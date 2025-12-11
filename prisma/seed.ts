import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await prisma.occurrenceHistory.deleteMany();
  await prisma.occurrence.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();

  // ========== CRIAR USUÁRIOS ==========
  console.log('Criando usuários...');
  
  const hashedPassword = await bcrypt.hash('123456', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        nome: 'Admin Sistema',
        email: 'admin@sisocc.com',
        senha: hashedPassword,
        cargo: 'Administrador',
        departamento: 'TI',
        telefone: '81999999999',
        avatar: 'AD',
        status: 'ATIVO',
        permissoes: ['Criar', 'Editar', 'Visualizar', 'Excluir', 'Gerenciar']
      }
    }),
    prisma.user.create({
      data: {
        nome: 'João Silva',
        email: 'joao@sisocc.com',
        senha: hashedPassword,
        cargo: 'Coordenador',
        departamento: 'Operações',
        telefone: '81988888888',
        avatar: 'JS',
        status: 'ATIVO',
        permissoes: ['Criar', 'Editar', 'Visualizar']
      }
    }),
    prisma.user.create({
      data: {
        nome: 'Maria Santos',
        email: 'maria@sisocc.com',
        senha: hashedPassword,
        cargo: 'Analista',
        departamento: 'Atendimento',
        telefone: '81977777777',
        avatar: 'MS',
        status: 'ATIVO',
        permissoes: ['Criar', 'Visualizar']
      }
    }),
    prisma.user.create({
      data: {
        nome: 'Carlos Oliveira',
        email: 'carlos@sisocc.com',
        senha: hashedPassword,
        cargo: 'Técnico',
        departamento: 'Campo',
        telefone: '81966666666',
        avatar: 'CO',
        status: 'ATIVO',
        permissoes: ['Visualizar']
      }
    }),
    prisma.user.create({
      data: {
        nome: 'Ana Costa',
        email: 'ana@sisocc.com',
        senha: hashedPassword,
        cargo: 'Supervisora',
        departamento: 'Operações',
        telefone: '81955555555',
        avatar: 'AC',
        status: 'ATIVO',
        permissoes: ['Criar', 'Editar', 'Visualizar']
      }
    })
  ]);

  console.log('✅ 5 usuários criados');

  // ========== CRIAR OCORRÊNCIAS ==========
  console.log('🚨 Criando ocorrências...');

  await prisma.occurrence.create({
    data: {
      tipo: 'QUEDA_ARVORE',
      local: 'Boa Viagem',
      endereco: 'Av. Boa Viagem, 1500',
      bairro: 'Boa Viagem',
      latitude: -8.1276,
      longitude: -34.9047,
      status: 'NOVO',
      prioridade: 'ALTA',
      descricao: 'Árvore caída bloqueando via',
      criadoPorId: users[1].id,
      responsavelId: users[0].id
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'ACIDENTE',
      local: 'Centro',
      endereco: 'Rua da Aurora, 200',
      bairro: 'Santo Amaro',
      latitude: -8.0578,
      longitude: -34.8829,
      status: 'EM_ATENDIMENTO',
      prioridade: 'CRITICA',
      descricao: 'Acidente de trânsito com vítimas',
      criadoPorId: users[2].id,
      responsavelId: users[3].id,
      dataAtendimento: new Date()
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'ENCHENTE',
      local: 'Recife Antigo',
      endereco: 'Rua do Bom Jesus, 50',
      bairro: 'Recife',
      latitude: -8.0631,
      longitude: -34.8711,
      status: 'EM_ANALISE',
      prioridade: 'ALTA',
      descricao: 'Alagamento após chuva forte',
      criadoPorId: users[1].id
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'ILUMINACAO',
      local: 'Casa Amarela',
      endereco: 'Estrada do Arraial, 1000',
      bairro: 'Casa Amarela',
      latitude: -8.0247,
      longitude: -34.9178,
      status: 'NOVO',
      prioridade: 'MEDIA',
      descricao: 'Poste de iluminação sem funcionar',
      criadoPorId: users[2].id
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'BURACO',
      local: 'Imbiribeira',
      endereco: 'Av. Mascarenhas de Morais, 3000',
      bairro: 'Imbiribeira',
      latitude: -8.1169,
      longitude: -34.9089,
      status: 'CONCLUIDO',
      prioridade: 'MEDIA',
      descricao: 'Buraco na pista causando danos aos veículos',
      criadoPorId: users[3].id,
      responsavelId: users[4].id,
      dataAtendimento: new Date(Date.now() - 86400000),
      dataConclusao: new Date(),
      tempoResposta: 120
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'BLOQUEIO_VIA',
      local: 'Boa Vista',
      endereco: 'Av. Conde da Boa Vista, 500',
      bairro: 'Boa Vista',
      latitude: -8.0522,
      longitude: -34.8936,
      status: 'EM_ATENDIMENTO',
      prioridade: 'ALTA',
      descricao: 'Via bloqueada por obra emergencial',
      criadoPorId: users[0].id,
      responsavelId: users[1].id,
      dataAtendimento: new Date()
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'DESLIZAMENTO',
      local: 'Morro da Conceição',
      endereco: 'Ladeira da Conceição, s/n',
      bairro: 'Morro da Conceição',
      latitude: -8.0745,
      longitude: -34.8794,
      status: 'NOVO',
      prioridade: 'CRITICA',
      descricao: 'Risco de deslizamento após chuvas',
      criadoPorId: users[4].id
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'INCENDIO',
      local: 'Derby',
      endereco: 'Praça do Derby, 100',
      bairro: 'Derby',
      latitude: -8.0489,
      longitude: -34.8933,
      status: 'CONCLUIDO',
      prioridade: 'CRITICA',
      descricao: 'Incêndio em estabelecimento comercial',
      criadoPorId: users[2].id,
      responsavelId: users[0].id,
      dataAtendimento: new Date(Date.now() - 3600000),
      dataConclusao: new Date(),
      tempoResposta: 15
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'VANDALISMO',
      local: 'Encruzilhada',
      endereco: 'Av. Norte, 2000',
      bairro: 'Encruzilhada',
      latitude: -8.0842,
      longitude: -34.9145,
      status: 'EM_ANALISE',
      prioridade: 'BAIXA',
      descricao: 'Pixação em patrimônio público',
      criadoPorId: users[3].id
    }
  });

  await prisma.occurrence.create({
    data: {
      tipo: 'OUTROS',
      local: 'Torre',
      endereco: 'Rua Ribeiro de Brito, 800',
      bairro: 'Torre',
      latitude: -8.0456,
      longitude: -34.9089,
      status: 'NOVO',
      prioridade: 'MEDIA',
      descricao: 'Animal silvestre em área urbana',
      criadoPorId: users[1].id
    }
  });

  console.log('✅ 10 ocorrências criadas');

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });