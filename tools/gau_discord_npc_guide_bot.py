#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GAU v5 — Bot NPC Guia & Sentinela do Discord
=============================================================================
Funcionalidades:
1. NPC Guia Interativo com Botões: ensina onde ir e o que fazer em cada ocasião.
2. Comando !guia e Boas-Vindas automáticas para novos membros.
3. Sentinela Anti-Call: desconecta qualquer tentativa de entrar em canal de voz.
=============================================================================
"""

import os
import sys
from datetime import datetime

try:
    import discord
    from discord.ext import commands
except ImportError:
    print("[ERRO] discord.py não está instalado! Execute: pip install discord.py")
    sys.exit(1)

# Caminho para arquivo de token local (facilita para o usuário colar)
TOKEN_FILE = os.path.join(os.path.dirname(__file__), "discord_token.txt")

def obter_token():
    # 1. Variável de ambiente
    token = os.getenv("DISCORD_BOT_TOKEN")
    if token and token.strip() and token.strip() != "SEU_TOKEN_AQUI":
        return token.strip()
    
    # 2. Arquivo local discord_token.txt
    if os.path.exists(TOKEN_FILE):
        try:
            with open(TOKEN_FILE, "r", encoding="utf-8") as f:
                token = f.read().strip()
                if token and token != "SEU_TOKEN_AQUI":
                    return token
        except Exception:
            pass
    
    return None

# Intents do Discord
intents = discord.Intents.default()
intents.voice_states = True
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ==================== VIEW COM BOTÕES INTERATIVOS (NPC GUIA) ====================
class NPCGuideView(discord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)  # Botões nunca expiram (Persistent View)

    @discord.ui.button(label="❓ Tirar Dúvidas", style=discord.ButtonStyle.primary, emoji="❓", custom_id="npc_btn_duvidas", row=0)
    async def btn_duvidas(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="❓ Como Tirar Dúvidas no Servidor",
            description=(
                "Travou em um código ou comando? Siga o roteiro:\n\n"
                "👉 **Onde ir:** Vá no canal **`#❓│duvidas`**\n"
                "👉 **O que mandar:**\n"
                "1. O que você estava tentando fazer.\n"
                "2. O comando exato que você digitou (ex: `/start`, `/goal`).\n"
                "3. Um print ou o texto exato da mensagem de erro que apareceu.\n\n"
                "⚠️ *Importante: Nunca mande senhas ou chaves pessoais nos prints!*"
            ),
            color=0x5865F2
        )
        embed.set_footer(text="NPC Guia GAU v5 • Suporte 100% por Texto")
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @discord.ui.button(label="🚀 Como Começar", style=discord.ButtonStyle.success, emoji="🚀", custom_id="npc_btn_comecar", row=0)
    async def btn_comecar(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="🚀 Primeiros Passos no GAU v5",
            description=(
                "Quer aprender a usar o GAU v5 e seus agentes autônomos?\n\n"
                "👉 **Onde ir:** Vá no canal **`#🚀│como-iniciar`**\n\n"
                "**Comandos Essenciais:**\n"
                "• `/start` ➔ Roda a inicialização, conecta ferramentas e alinha o agente com você.\n"
                "• `/goal <tarefa>` ➔ Executa engenharia autônoma completa com testes no terminal!\n"
                "• `/gau` ➔ Abre o cardápio mestre com todos os 31 subagentes e capacidades.\n"
                "• `/doctor` ➔ Checa a saúde do Python, Git e banco de dados.\n"
            ),
            color=0x57F287
        )
        embed.set_footer(text="NPC Guia GAU v5 • Comece pelo /start")
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @discord.ui.button(label="🐛 Reportar Bug", style=discord.ButtonStyle.danger, emoji="🐛", custom_id="npc_btn_bugs", row=0)
    async def btn_bugs(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="🐛 Reportar um Erro ou Bug",
            description=(
                "Encontrou um erro no sistema GAU v5 ou no site?\n\n"
                "👉 **Onde ir:** Vá no canal **`#🐛│reportar-bugs`**\n"
                "👉 **O que mandar:**\n"
                "• Onde aconteceu (site, terminal do Windows ou prompt).\n"
                "• O que você fez para o erro acontecer.\n"
                "• Print da tela ou log de erro do terminal.\n\n"
                "A moderação e os desenvolvedores analisarão e corrigirão o quanto antes!"
            ),
            color=0xED4245
        )
        embed.set_footer(text="NPC Guia GAU v5 • Caçador de Bugs")
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @discord.ui.button(label="💡 Dar Sugestões", style=discord.ButtonStyle.secondary, emoji="💡", custom_id="npc_btn_sugestoes", row=1)
    async def btn_sugestoes(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="💡 Sugestões de Skills & Melhorias",
            description=(
                "Teve uma ideia incrível de nova habilidade, subagente ou melhoria?\n\n"
                "👉 **Para novas skills/agentes:** Vá no canal **`#🤖│sugestoes-skills`**\n"
                "👉 **Para melhorias no site ou sistema:** Vá no canal **`#🔧│melhorias`**\n\n"
                "Diga o nome da ideia e como ela ajudaria no dia a dia!"
            ),
            color=0xFEE75C
        )
        embed.set_footer(text="NPC Guia GAU v5 • Construído com a Comunidade")
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @discord.ui.button(label="💬 Bate-Papo & Memes", style=discord.ButtonStyle.secondary, emoji="💬", custom_id="npc_btn_chat", row=1)
    async def btn_chat(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="💬 Conecte-se com a Comunidade",
            description=(
                "Quer relaxar, fazer networking ou mandar memes?\n\n"
                "👉 **Para conversar sobre tech e IA:** Vá no **`#💬│chat-geral`**\n"
                "👉 **Para mandar memes e descontrair:** Vá no **`#🐸│memes`**\n"
                "👉 **Para mostrar seus projetos prontos:** Vá no **`#💻│mostre-seu-projeto`**\n"
            ),
            color=0xEB459E
        )
        embed.set_footer(text="NPC Guia GAU v5 • Resenha & Tecnologia")
        await interaction.response.send_message(embed=embed, ephemeral=True)

    @discord.ui.button(label="📜 Regras Oficiais", style=discord.ButtonStyle.primary, emoji="📜", custom_id="npc_btn_regras", row=1)
    async def btn_regras(self, interaction: discord.Interaction, button: discord.ui.Button):
        embed = discord.Embed(
            title="📜 Regras Oficiais do Servidor",
            description=(
                "👉 **Consulte o canal completo:** **`#📋│regras`**\n\n"
                "🚫 **1. REGRA DE OURO:** Suporte 100% por CHAT e TEXTO. **NÃO USE CALL!**\n"
                "🤝 **2. RESPEITO:** Zero ofensas, brigas ou preconceito.\n"
                "🛡️ **3. SEM SPAM:** Proibido flood e divulgação não autorizada.\n"
                "🔒 **4. SEGURANÇA:** Nunca compartilhe senhas ou chaves pessoais.\n"
            ),
            color=0x9B59B6
        )
        embed.set_footer(text="NPC Guia GAU v5 • Convivência e Segurança")
        await interaction.response.send_message(embed=embed, ephemeral=True)

def criar_embed_guia_principal():
    embed = discord.Embed(
        title="🤖 NPC GUIA — BEM-VINDO AO SUPORTE DO GAU v5!",
        description=(
            "Olá! Eu sou o **Assistente Virtual do GAU v5**.\n"
            "Estou aqui para guiar sua navegação e te mostrar exatamente onde ir e o que fazer!\n\n"
            "👇 **Clique no botão abaixo correspondente ao que você precisa fazer agora:**"
        ),
        color=0x5865F2
    )
    embed.add_field(name="❓ Tirar Dúvidas", value="Dúvidas de código, erros e comandos.", inline=True)
    embed.add_field(name="🚀 Como Começar", value="Guia rápido do /start e /goal.", inline=True)
    embed.add_field(name="🐛 Reportar Bugs", value="Encontrou uma falha no sistema.", inline=True)
    embed.add_field(name="💡 Sugestões", value="Ideias de novas skills e melhorias.", inline=True)
    embed.add_field(name="💬 Comunidade", value="Bate-papo geral, projetos e memes.", inline=True)
    embed.add_field(name="📜 Regras", value="Lembrete: Suporte 100% por CHAT!", inline=True)
    embed.set_footer(text="GAU v5 Bot • Clique nos botões para abrir o tutorial")
    return embed

# ==================== EVENTOS DO BOT ====================
@bot.event
async def on_ready():
    # Registra a view persistente para que botões funcionem mesmo após reinicializações
    bot.add_view(NPCGuideView())
    print("=" * 65)
    print(f"🤖 GAU v5 NPC Guia & Sentinela ONLINE!")
    print(f"👤 Bot Conectado: {bot.user} (ID: {bot.user.id})")
    print(f"🛡️ Servidores: {len(bot.guilds)}")
    for g in bot.guilds:
        print(f"   • {g.name} (Membros: {g.member_count})")
    print("✨ Recursos Ativos: NPC Guia Interativo + Sentinela Anti-Call")
    print("=" * 65)

    activity = discord.Activity(
        type=discord.ActivityType.watching,
        name="Digite !guia | 🚫 NÃO USE CALL"
    )
    await bot.change_presence(status=discord.Status.online, activity=activity)

@bot.event
async def on_member_join(member):
    """Quando um novo membro entra no servidor, envia o painel do NPC Guia."""
    # Procura um canal de boas-vindas ou chat-geral
    canal_alvo = None
    for nome in ["chat-geral", "geral", "suporte-do-gau", "boas-vindas"]:
        canal_alvo = discord.utils.get(member.guild.text_channels, name=nome)
        if canal_alvo:
            break
    
    if not canal_alvo:
        canal_alvo = member.guild.system_channel or (member.guild.text_channels[0] if member.guild.text_channels else None)

    if canal_alvo and canal_alvo.permissions_for(member.guild.me).send_messages:
        try:
            await canal_alvo.send(
                content=f"👋 Olá {member.mention}! Seja muito bem-vindo ao **{member.guild.name}**!\nEu sou o **NPC Guia** e estou aqui para te ajudar a navegar no servidor:",
                embed=criar_embed_guia_principal(),
                view=NPCGuideView()
            )
        except Exception as e:
            print(f"[ERRO on_member_join] {e}")

@bot.command(name="guia")
async def cmd_guia(ctx):
    """Comando !guia: Exibe o painel interativo do NPC Guia."""
    await ctx.send(embed=criar_embed_guia_principal(), view=NPCGuideView())

@bot.event
async def on_voice_state_update(member, before, after):
    """Sentinela Anti-Call: desconecta imediatamente qualquer usuário em call de voz."""
    if after.channel is not None and not member.bot:
        canal_nome = after.channel.name
        try:
            await member.move_to(None, reason="Regra GAU v5: Chamadas de voz proibidas. Suporte 100% por chat.")
            print(f"[{datetime.now().strftime('%H:%M:%S')}] 🚫 Desconectado: {member.name} da call '{canal_nome}'")

            # Tenta mandar aviso na DM
            try:
                msg = (
                    f"🚨 **[AVISO GAU v5]** Olá, {member.name}!\n\n"
                    f"Você foi desconectado automaticamente da call `{canal_nome}`.\n"
                    f"📌 **REGRA:** *NÃO USE CALL! NOSSO SUPORTE É 100% VIA CHAT/TEXTO.*\n"
                    f"Todas as dúvidas e tutoriais são resolvidos nos canais de texto para ficarem salvos para a comunidade!\n\n"
                    f"👉 Digite `!guia` no servidor para ver o canal certo para a sua dúvida!"
                )
                await member.send(msg)
            except Exception:
                pass
        except Exception as e:
            print(f"[ERRO Anti-Call] Não foi possível desconectar {member.name}: {e}")

# ==================== INICIALIZAÇÃO ====================
if __name__ == "__main__":
    token = obter_token()
    if not token:
        print("\n" + "=" * 65)
        print("❌ TOKEN DO DISCORD NÃO ENCONTRADO!")
        print("=" * 65)
        print("Para ligar o seu bot:")
        print(f"1. Crie o arquivo: {TOKEN_FILE}")
        print("2. Cole o Token do seu bot dentro dele.")
        print("OU defina a variável de ambiente DISCORD_BOT_TOKEN.")
        print("=" * 65 + "\n")
        
        # Pergunta no terminal caso o usuário esteja rodando interativamente
        try:
            token_input = input("Cole o Token do Bot aqui e aperte Enter: ").strip()
            if token_input:
                with open(TOKEN_FILE, "w", encoding="utf-8") as f:
                    f.write(token_input)
                print(f"✅ Token salvo em {TOKEN_FILE}!")
                token = token_input
            else:
                sys.exit(1)
        except (KeyboardInterrupt, EOFError):
            sys.exit(1)

    print("🚀 Iniciando GAU NPC Guia Bot...")
    bot.run(token)
