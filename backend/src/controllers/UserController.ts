import { getRepository, Not, Repository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import VerificaSeOEmailExiste from "../helpers/VerificaSeOEmailExiste";
import { Lancamento } from "../entities/Lancamento";
import { Category } from "../entities/Category";
import { Conta } from "../entities/Conta";
import { Parcela } from "../entities/Parcela";

function addMonths(date: Date, months: number) {
  var d = date.getDate();
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0);
  }
  return date;
}

class UserController {
  async index(request: Request, response: Response, next: NextFunction) {
    return response.send({ userID: request.userId });
  }

  async setupUser(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const lancamentoRepository = getRepository(Lancamento);
    const categoryRepository = getRepository(Category);
    const contaRepository = getRepository(Conta);
    const parcelaRepository = getRepository(Parcela);

    const user = await userRepository.findOne({
      where: { id: request.params.id },
    });

    const entries = request.body.entries;
    const allCategories = request.body.allCategories;
    const accounts = request.body.accounts;

    console.log(accounts);
    console.log("------------");
    console.log(entries);

    allCategories.push({
      iconeCategoria: "Ionicons:rocket-sharp",
      tetoDeGastos: 0,
      nomeCategoria: "Meta",
      tipoCategoria: "despesa",
      userCategory: user,
      corCategoria: "#ee4266",
    }, {
      iconeCategoria: "Entypo:dots-three-horizontal",
      tetoDeGastos: 0,
      nomeCategoria: "Outro",
      tipoCategoria: "despesa",
      userCategory: user,
      corCategoria: "#884372",
    }, {
      iconeCategoria: "Entypo:dots-three-horizontal",
      tetoDeGastos: 0,
      nomeCategoria: "Outro",
      tipoCategoria: "receita",
      userCategory: user,
      corCategoria: "#559972",
    });

    if (!user) {
      return response.send({ error: "Usuario nao encontrado" });
    }

    // Contas
    const initialAccounts = [];

    accounts.map(async (account) => {
      const newAccount = contaRepository.create({
        descricao: account.descricao,
        tipo: account.tipo,
        instituicao: account.instituicao,
        saldoConta: account.saldoConta,
        userConta: user,
      });
      initialAccounts.push(await contaRepository.save(newAccount));
    });

    // Categorias
    const categoriasPadroes = [];

    for (var i = 0; i < allCategories.length; i++) {
      const funcao = async (categoryLancamento) => {
        const newCategoria = categoryRepository.create({
          iconeCategoria: categoryLancamento.iconeCategoria,
          tetoDeGastos: 0,
          nomeCategoria: categoryLancamento.nomeCategoria,
          tipoCategoria: categoryLancamento.tipoCategoria,
          userCategory: user,
          corCategoria: categoryLancamento.corCategoria,
        });

        categoriasPadroes.push(await categoryRepository.save(newCategoria));
      };

      await funcao(allCategories[i]);
    }

    // Lancamentos
    entries.map(async (item) => {
      const categoriaLancamento = categoriasPadroes.findIndex((categoria) => {
        return categoria.nomeCategoria == item.categoryLancamento.nomeCategoria;
      });

      const newLancamento = await lancamentoRepository.save(
        lancamentoRepository.create({
          descricaoLancamento: item.descricaoLancamento,
          essencial: true,
          lugarLancamento: "extrato",
          parcelaBaseada: 0,
          tipoLancamento: item.tipoLancamento,
          userLancamento: user,
          categoryLancamento: categoriasPadroes[categoriaLancamento],
        })
      );

      // Parcela
      item.parcelasLancamento;
      const newParcela = parcelaRepository.create({
        contaParcela: initialAccounts[1],
        lancamentoParcela: newLancamento,
        userParcela: user,
        statusParcela:
          new Date(item.parcelasLancamento[0].dataParcela) > new Date()
            ? false
            : true,
        valorParcela: item.parcelasLancamento[0].valorParcela,
        dataParcela: item.parcelasLancamento[0].dataParcela,
      });

      await parcelaRepository.save(newParcela);

      const updateDate = new Date(newParcela.dataParcela);
      newParcela.id = undefined;

      let parcela: any;
      for (var i = 1; i < 24; i++) {
        addMonths(updateDate, 1);
        parcela = parcelaRepository.create(newParcela);

        parcela.dataParcela = new Date(updateDate);

        parcela.statusParcela = false;

        await parcelaRepository.save(parcela);
      }
    });

    return response.send({ message: entries });
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const user = await userRepository.find({join: {
      alias: 'user',
      leftJoinAndSelect: {
        config: 'user.configUser'
      }
    }});
    return response.send({ user });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({
      where: { id: request.params.id },
      join: {
        alias: "user",
        leftJoinAndSelect: {
          config: "user.configUser"
        }
      }
    });
    return response.send({ user });
  }

  async auth(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);

    const { emailUsuario, senhaUsuario } = request.body;

    if (emailUsuario == "" && senhaUsuario == "")
      return response.send({
        message: "Preencha todos os campos!",
        error: "both",
      });

    if (emailUsuario == "")
      return response.send({
        message: "Email em branco!",
        error: "email",
      });

    if (senhaUsuario == "")
      return response.send({
        message: "Senha em branco!",
        error: "senha",
      });

    const user = await userRepository.findOne({
      where: { emailUsuario },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          config: 'user.configUser'
        }
      }
    });

    if (!user)
      return response.send({
        message: "Email não encontrado!",
        error: "email",
      });

    const isValidPassword = await bcrypt.compare(
      senhaUsuario,
      user.senhaUsuario
    );

    if (!isValidPassword)
      return response.send({
        message: "Senha incorreta!",
        error: "senha",
      });

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });

    delete user.senhaUsuario;

    return response.send({
      user: {
        id: user.id,
        nomeUsuario: user.nomeUsuario,
        emailUsuario: user.emailUsuario,
        senhaUsuario: user.senhaUsuario,
        fotoPerfilUsuario:
          user.fotoPerfilUsuario != null
            ? user.fotoPerfilUsuario.toString()
            : null,
        config: user.configUser
      },
      token,
    });
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const { nomeUsuario, emailUsuario, senhaUsuario, fotoPerfilUsuario } =
      request.body;

    if (!VerificaSeOEmailExiste(emailUsuario))
      return response.send({ error: "Formato de email inválido" });
    if (emailUsuario == "" || emailUsuario == undefined)
      return response.send({ error: "Digite seu email!" });
    if (senhaUsuario == "" || senhaUsuario == undefined)
      return response.send({ error: "Digite sua senha!" });

    const userexists = await userRepository.find({ where: { emailUsuario } });
    if (userexists.length > 0)
      return response.send({ error: "Email já cadastrado" });

    if (nomeUsuario == "" || nomeUsuario == undefined)
      return response.send({ error: "Nome não especificado" });

    const user = userRepository.create(request.body);
    await userRepository.save(user);

    return response.send({ user });
  }

  async edit(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const id = parseInt(request.params.id);

    const { nomeUsuario, emailUsuario, senhaUsuario, fotoPerfilUsuario } =
      request.body;

    if (nomeUsuario == "") return response.send({ error: "Nome em branco!" });
    if (emailUsuario == "") return response.send({ error: "Email em branco!" });
    if (senhaUsuario == "") return response.send({ error: "Senha em branco!" });

    const userexists = await userRepository.findOne({
      where: { emailUsuario, id: Not(id) },
    });    

    if (
      userexists
    )
      return response.send({ error: "Email já cadastrado" });

    const upUser = request.body
    upUser.id = id

    await userRepository.save(userRepository.create(upUser));
    const updatedUser = await userRepository.findOne({ where: { id } });

    return response.send({ updatedUser });
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    let userToRemove = await userRepository.findOne(request.params.id);
    await userRepository.remove(userToRemove);
    return response.send({ mes: "foi" });
  }

  async removeAll(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    let userToRemove = await userRepository.find();
    await userRepository.remove(userToRemove);
    return response.send({ mes: "foi" });
  }

  async emailExists(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);
    const { emailUsuario } = request.body;

    const existing = await userRepository.find({ where: { emailUsuario } });
    if (existing.length > 0) return response.send({ exists: true });
    return response.send({ exists: false });
  }

  async avatar(request: Request, response: Response, next: NextFunction) {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({
      where: { id: request.params.id },
    });

    return response.send({
      avatar:
        user.fotoPerfilUsuario != null
          ? user.fotoPerfilUsuario.toString()
          : null,
    });
  }
}

export default new UserController();
