@echo off
title GAU v5 — Bot NPC Guia e Sentinela Discord
chcp 65001 > nul
cls
echo =====================================================================
echo           GAU v5 — BOT NPC GUIA & SENTINELA DISCORD
echo =====================================================================
echo.
echo Verificando Python e dependencias...

py -3 -c "import discord" 2>nul
if %errorlevel% neq 0 (
    echo [AVISO] Instalando biblioteca discord.py...
    py -3 -m pip install --upgrade discord.py
)

echo.
echo Iniciando o Bot NPC Guia...
echo.
py -3 "%~dp0gau_discord_npc_guide_bot.py"

echo.
echo Bot finalizado.
pause
