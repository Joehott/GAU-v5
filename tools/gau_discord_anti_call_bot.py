#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GAU v5 — Bot Sentinela Anti-Call para Discord
=============================================================================
REGRA INVIOLÁVEL: NÃO USE CALL! SUPORTE 100% POR CHAT E TEXTO.

Este bot monitora conexões de voz em tempo real. Se qualquer membro tentar
entrar em um canal de voz ou iniciar uma chamada no servidor, o bot:
1. Desconecta o membro instantaneamente (kick da call).
2. Envia um aviso educativo no privado (DM) reforçando a regra de suporte por texto.
3. Registra o evento no canal de avisos e nos logs do console.
=============================================================================
Como usar:
1. Instale a biblioteca: pip install discord.py
2. Crie uma aplicação no Discord Developer Portal (https://discord.com/developers/applications)
3. Cole o TOKEN do bot abaixo ou na variável de ambiente DISCORD_BOT_TOKEN
4. Execute: py -3 gau_discord_anti_call_bot.py
"""

import os
import sys
from datetime import datetime

try:
    import discord
    from discord.ext import commands
except ImportError:
    print("[ERRO] discord.py não está instalado!")
    print("Execute no terminal: pip install discord.py")
    sys.exit(1)

# Configuração do Token
TOKEN = os.getenv("DISCORD_BOT_TOKEN", "SEU_TOKEN_AQUI")

# Intents necessários para monitorar membros e canais de voz
intents = discord.Intents.default()
intents.voice_states = True
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="!gau ", intents=intents)

MENSAGEM_AVISO_CALL = (
    "🚨 **[GAU v5 Oficial — AVISO DE SEGURANÇA]** 🚨\n\n"
    "Olá, {nome}! Você foi desconectado automaticamente da chamada de voz.\n\n"
    "📌 **REGRA DO SERVIDOR:** *NÃO USE CALL! NOSSO SUPORTE É 100% VIA CHAT/TEXTO.*\n"
    "Todas as dúvidas, comandos de código, correções de bugs e tutoriais devem ser "
    "tratados exclusivamente nos canais de texto para que o histórico fique gravado "
    "e ajude outros desenvolvedores da comunidade!\n\n"
    "💡 Use os canais:\n"
    "• `#duvidas-gau` — Dúvidas de instalação e comandos /goal\n"
    "• `#suporte-tecnico` — Relato de problemas e análise de logs\n"
    "• `#chat-geral` — Conversa com outros membros da comunidade\n\n"
    "Agradecemos a sua colaboração! 🤝"
)

@bot.event
async def on_ready():
    print("=" * 65)
    print(f"🤖 GAU v5 Sentinela Anti-Call Ativo!")
    print(f"👤 Bot Conectado: {bot.user} (ID: {bot.user.id})")
    print(f"🛡️ Servidores Monitorados: {len(bot.guilds)}")
    for g in bot.guilds:
        print(f"   • {g.name} (Membros: {g.member_count})")
    print("🚫 Diretriz Ativa: Bloqueio Imediato de Calls e Canais de Voz")
    print("=" * 65)

    # Define o status do bot no Discord
    activity = discord.Activity(
        type=discord.ActivityType.watching,
        name="🚫 NÃO USE CALL! Suporte só por texto"
    )
    await bot.change_presence(status=discord.Status.online, activity=activity)

@bot.event
async def on_voice_state_update(member, before, after):
    """
    Acionado sempre que alguém entra, sai, muta ou troca de canal de voz.
    Se o membro estiver em um canal de voz (after.channel is not None),
    ele é expulso imediatamente da call.
    """
    # Ignora o próprio bot
    if member.bot:
        return

    # Se o membro entrou em um canal de voz
    if after.channel is not None:
        canal_nome = after.channel.name
        guild_nome = member.guild.name
        timestamp = datetime.now().strftime("%H:%M:%S")

        print(f"[{timestamp}] ⚠️ Alerta: {member.name} tentou entrar no canal de voz '{canal_nome}' em '{guild_nome}'!")

        try:
            # 1. Desconecta o membro imediatamente da chamada
            await member.move_to(None, reason="Regra GAU v5: Chamadas de voz desativadas.")
            print(f"[{timestamp}] 🚫 {member.name} foi desconectado com sucesso da call!")

            # 2. Tenta enviar DM para o membro
            try:
                msg = MENSAGEM_AVISO_CALL.format(nome=member.display_name)
                await member.send(msg)
                print(f"[{timestamp}] 📩 Mensagem de aviso enviada no privado para {member.name}.")
            except discord.Forbidden:
                print(f"[{timestamp}] ℹ️ Não foi possível enviar DM (mensagens privadas bloqueadas pelo usuário).")

            # 3. Notifica no canal de avisos ou no primeiro canal de texto disponível
            canal_notificacao = None
            for c in member.guild.text_channels:
                if "aviso" in c.name or "regras" in c.name or "suporte" in c.name or "chat" in c.name:
                    canal_notificacao = c
                    break

            if canal_notificacao:
                embed = discord.Embed(
                    title="🚫 Chamada de Voz Bloqueada",
                    description=(
                        f"O usuário **{member.mention}** tentou conectar-se ao canal de voz e foi desconectado.\n"
                        f"Lembramos a todos: **Este servidor opera 100% por chat e texto.**"
                    ),
                    color=0xED4245,  # Vermelho Discord
                    timestamp=datetime.now()
                )
                embed.set_footer(text="GAU v5 Security Guard • Anti-Call System")
                await canal_notificacao.send(embed=embed)

        except Exception as e:
            print(f"[{timestamp}] [ERRO] Falha ao desconectar membro: {e}")

@bot.command(name="status")
async def cmd_status(ctx):
    """Comando para verificar se o sentinela anti-call está operacional."""
    embed = discord.Embed(
        title="🛡️ GAU v5 Sentinela Anti-Call — Status",
        description=(
            "✅ **Sistema Operacional em Tempo Real!**\n\n"
            "• **Monitoramento de Voz:** ATIVO (Desconexão instantânea)\n"
            "• **Diretriz:** Chamadas bloqueadas permanentemente\n"
            "• **Suporte Oficial:** Apenas canais de texto e código\n"
        ),
        color=0x5865F2  # Blurple Discord
    )
    embed.set_footer(text="Global Agentic Universe v5")
    await ctx.send(embed=embed)

if __name__ == "__main__":
    if TOKEN == "SEU_TOKEN_AQUI":
        print("\n" + "!" * 65)
        print("ATENÇÃO: Substitua 'SEU_TOKEN_AQUI' pelo token do seu bot")
        print("ou configure a variável de ambiente DISCORD_BOT_TOKEN.")
        print("Acesse: https://discord.com/developers/applications")
        print("!" * 65 + "\n")
    try:
        bot.run(TOKEN)
    except Exception as e:
        print(f"\n[ERRO DE EXECUÇÃO] {e}")
