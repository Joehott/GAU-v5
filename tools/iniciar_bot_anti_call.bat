@echo off
title GAU v5 - Bot Sentinela Anti-Call Discord
color 0B
echo =====================================================================
echo           GAU v5 - BOT SENTINELA ANTI-CALL DISCORD
echo      REGRA: NAO USE CALL! SUPORTE 100%% VIA CHAT E TEXTO
echo =====================================================================
echo.

py -3 -c "import discord" 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Instalando a biblioteca discord.py necesssaria...
    py -3 -m pip install discord.py
    echo.
)

echo [STATUS] Iniciando o bot Anti-Call...
py -3 "%~dp0gau_discord_anti_call_bot.py"

pause
