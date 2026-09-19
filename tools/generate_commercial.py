#!/usr/bin/env python3
"""
Generates the official high-definition (1080p Full HD) commercial video for GAU v5.
Includes:
- Neural voiceover narration in Brazilian Portuguese (edge-tts)
- Procedural cybernetic background music with bass, arpeggios and transition sweeps
- Dynamic motion graphics, typography, glowing badges, animated orbital nodes
- The official GAU robot avatar
- The final Call-To-Action screen highlighting "gau-oficial.vercel.app" and "ACESSE AGORA!"
"""

import asyncio
import json
import math
import os
from pathlib import Path
import shutil
import subprocess
import sys

import edge_tts
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr.reconfigure(encoding='utf-8')

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'site' / 'assets'
AVATAR_PATH = ASSETS / 'gau-avatar.png'
DESKTOP = Path(r'C:\Users\Joe\Desktop')
OUTPUT_MP4 = DESKTOP / 'GAU_v5_Comercial_Oficial.mp4'
TEMP_DIR = ROOT / 'tools' / '_temp_video'

WIDTH = 1920
HEIGHT = 1080
FPS = 30

FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_BLACK = "C:/Windows/Fonts/ariblk.ttf" if Path("C:/Windows/Fonts/ariblk.ttf").exists() else FONT_BOLD
FONT_CODE = "C:/Windows/Fonts/consola.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

# Audio script & texts
SCENES_SCRIPT = [
    {
        "id": 1,
        "title": "O Desafio",
        "text": "Cansado de comandos de inteligência artificial que erram, esquecem o contexto e alucinam código?",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+10%",
    },
    {
        "id": 2,
        "title": "A Solução",
        "text": "Conheça o GAU v5! A mais poderosa arquitetura cognitiva de agentes autônomos para o Google Antigravity!",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+10%",
    },
    {
        "id": 3,
        "title": "O Poder",
        "text": "Com 16 agentes especialistas e 69 mecanismos cognitivos, ele transforma o comando barra goal em uma máquina de execução implacável com prova e verificação.",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+10%",
    },
    {
        "id": 4,
        "title": "Chamada para Ação",
        "text": "Chega de perder tempo com código quebrado! Acesse agora o site oficial: gau-oficial ponto vercel ponto app e entre no canal oficial do WhatsApp. Acesse agora!",
        "voice": "pt-BR-AntonioNeural",
        "rate": "+10%",
    },
]

async def generate_voiceovers(temp_dir: Path):
    audio_files = []
    durations = []
    print("[1/5] Gerando narração neural em português...")
    for scene in SCENES_SCRIPT:
        mp3_path = temp_dir / f"voice_scene_{scene['id']}.mp3"
        comm = edge_tts.Communicate(scene['text'], scene['voice'], rate=scene['rate'])
        await comm.save(str(mp3_path))
        
        # Get duration
        cmd = ['ffprobe', '-v', 'quiet', '-print_format', 'json', '-show_format', str(mp3_path)]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        dur = float(json.loads(res.stdout)['format']['duration'])
        
        # Add padding (0.6s for scenes 1-3, 2.2s on final CTA so link stays on screen)
        target_dur = dur + (2.2 if scene['id'] == 4 else 0.6)
        audio_files.append(mp3_path)
        durations.append(target_dur)
        print(f"   -> Cena {scene['id']}: áudio {dur:.2f}s (duração cena: {target_dur:.2f}s)")
        
    return audio_files, durations

def synthesize_background_music(total_duration: float, output_wav: Path):
    print(f"[2/5] Sintetizando trilha sonora cibernética ({total_duration:.1f}s)...")
    sample_rate = 44100
    n_samples = int(total_duration * sample_rate)
    t = np.linspace(0, total_duration, n_samples, False)
    
    # 1. Sub Bass Drone (55 Hz - Note A1) with gentle pulse
    sub_drone = 0.25 * np.sin(2 * np.pi * 55 * t) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.5 * t))
    
    # 2. Mid Synth Bass (110 Hz - Note A2) with filter pulsation
    mid_bass = 0.15 * np.sin(2 * np.pi * 110 * t) * (0.7 + 0.3 * np.sin(2 * np.pi * 2.0 * t))
    
    # 3. Rhythmic 120 BPM pulse (2 Hz)
    bpm_pulse = (np.sin(2 * np.pi * 2.0 * t) ** 4) * 0.12 * np.sin(2 * np.pi * 220 * t)
    
    # 4. Hi-hat rhythmic clicks (8 Hz = 16th notes at 120 BPM)
    hi_noise = np.random.uniform(-1, 1, n_samples)
    hi_env = (np.sin(2 * np.pi * 4.0 * t) ** 16)
    hi_hat = 0.04 * hi_noise * hi_env
    
    # 5. Cybernetic ambient pad chord (A minor: 440 Hz, 523.25 Hz, 659.25 Hz)
    pad = 0.06 * (np.sin(2 * np.pi * 220 * t) + np.sin(2 * np.pi * 261.63 * t) + np.sin(2 * np.pi * 329.63 * t))
    pad *= (0.6 + 0.4 * np.sin(2 * np.pi * 0.2 * t))
    
    # Combine
    mix = sub_drone + mid_bass + bpm_pulse + hi_hat + pad
    
    # Fade in (1s) and Fade out (2s)
    fade_in_len = int(sample_rate * 1.0)
    fade_out_len = int(sample_rate * 2.0)
    mix[:fade_in_len] *= np.linspace(0, 1, fade_in_len)
    mix[-fade_out_len:] *= np.linspace(1, 0, fade_out_len)
    
    # Normalize to avoid clipping
    max_val = np.max(np.abs(mix))
    if max_val > 0:
        mix = mix / max_val * 0.85
        
    # Convert to 16-bit PCM
    audio_int16 = (mix * 32767).astype(np.int16)
    
    import wave
    with wave.open(str(output_wav), 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(audio_int16.tobytes())

def draw_cyber_grid(draw, width, height, t, color=(20, 35, 60)):
    # Perspective grid lines on floor
    horizon = int(height * 0.65)
    center_x = width // 2
    
    # Radiating lines from vanishing point
    for angle in range(-70, 71, 10):
        rad = math.radians(angle)
        x_end = center_x + int(math.tan(rad) * (height - horizon) * 2.5)
        draw.line([(center_x, horizon), (x_end, height)], fill=color, width=1)
        
    # Horizontal grid lines moving forward with time
    speed = (t * 50) % 40
    for y_offset in range(0, height - horizon, 30):
        curr_y = horizon + int(((y_offset + speed) / (height - horizon)) ** 1.8 * (height - horizon))
        if curr_y < height:
            alpha_ratio = (curr_y - horizon) / (height - horizon)
            c = (int(color[0] * alpha_ratio), int(color[1] * alpha_ratio), int(color[2] * alpha_ratio))
            draw.line([(0, curr_y), (width, curr_y)], fill=c, width=1)

def draw_centered_text(draw, y, text, font, fill):
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    x = (WIDTH - text_w) // 2
    draw.text((x, y), text, fill=fill, font=font)
    return x, y, text_w

def draw_badge(draw, x, y, text, font, text_color, dot_color, bg_color, border_color, padding_x=22, height=44):
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    total_w = text_w + padding_x * 2 + 28
    draw.rounded_rectangle([x, y, x + total_w, y + height], radius=height // 2, fill=bg_color, outline=border_color, width=2)
    dot_r = 5
    dot_cy = y + height // 2
    draw.ellipse([x + padding_x - 4, dot_cy - dot_r, x + padding_x + 6, dot_cy + dot_r], fill=dot_color)
    draw.text((x + padding_x + 18, y + 10), text, fill=text_color, font=font)
    return total_w

def draw_centered_badge(draw, y, text, font, text_color, dot_color, bg_color, border_color, padding_x=22, height=44):
    bbox = font.getbbox(text)
    text_w = bbox[2] - bbox[0]
    total_w = text_w + padding_x * 2 + 28
    x = (WIDTH - total_w) // 2
    draw.rounded_rectangle([x, y, x + total_w, y + height], radius=height // 2, fill=bg_color, outline=border_color, width=2)
    dot_r = 5
    dot_cy = y + height // 2
    draw.ellipse([x + padding_x - 4, dot_cy - dot_r, x + padding_x + 6, dot_cy + dot_r], fill=dot_color)
    draw.text((x + padding_x + 18, y + 10), text, fill=text_color, font=font)
    return x, total_w

def render_frame(scene_idx: int, local_t: float, scene_dur: float, global_t: float, avatar_img: Image.Image):
    # Base canvas
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(7, 10, 19))
    draw = ImageDraw.Draw(img)
    
    # Dynamic cyber grid
    draw_cyber_grid(draw, WIDTH, HEIGHT, global_t, color=(16, 32, 58))
    
    # Top progress line across whole commercial
    progress_w = int(WIDTH * (global_t / 34.5))
    draw.rectangle([0, 0, progress_w, 4], fill=(37, 211, 102))
    
    # Header bar
    font_brand = get_font(FONT_BOLD, 26)
    draw.text((60, 40), "GAU v5", fill=(37, 211, 102), font=font_brand)
    draw.text((160, 42), "// COGNITIVE ORCHESTRATION LAYER", fill=(140, 160, 190), font=get_font(FONT_REGULAR, 20))
    
    live_dot_color = (37, 211, 102) if int(global_t * 2) % 2 == 0 else (18, 140, 126)
    draw.ellipse([WIDTH - 180, 48, WIDTH - 168, 60], fill=live_dot_color)
    draw.text((WIDTH - 155, 42), "ONLINE", fill=(220, 240, 255), font=get_font(FONT_BOLD, 18))
    
    # Scene Specific Rendering
    if scene_idx == 0:
        # SCENE 1: O PROBLEMA
        draw_badge(draw, 60, 140, "ALERTA // O DILEMA DA I.A. TRADICIONAL", get_font(FONT_BOLD, 20), (255, 100, 100), (255, 75, 75), (40, 15, 20), (255, 75, 75))
        
        # Big punchy question lines
        font_main = get_font(FONT_BOLD, 54)
        draw.text((60, 240), "Seu agente de I.A. esqueceu o contexto?", fill=(255, 255, 255), font=font_main)
        draw.text((60, 320), "O código gerado quebrou nos testes?", fill=(255, 255, 255), font=font_main)
        draw.text((60, 400), "Entrou em loops infinitos e alucinou?", fill=(255, 80, 80), font=font_main)
        
        # 3 Pain Point Boxes
        box_y = 540
        box_w = 540
        box_h = 240
        pain_points = [
            ("[ ! ]  ALUCINAÇÃO & RESPOSTAS FALSAS", "Garante que o código funciona sem nunca ter executado de verdade.", (255, 60, 60)),
            ("[ ! ]  ESQUECIMENTO DE CONTEXTO", "Perde o objetivo no meio da tarefa e sobrescreve regras do projeto.", (255, 140, 60)),
            ("[ ! ]  SEM PROVAS OU EVIDÊNCIAS", "Declara vitória sem testes discriminatórios, gerando retrabalho.", (255, 190, 60)),
        ]
        
        for i, (title, desc, stroke_c) in enumerate(pain_points):
            bx = 60 + i * (box_w + 50)
            anim_offset = int(max(0, 1.0 - (local_t - i * 0.4) * 3) * 50)
            cur_by = box_y + anim_offset
            
            draw.rounded_rectangle([bx, cur_by, bx + box_w, cur_by + box_h], radius=16, fill=(16, 20, 32), outline=stroke_c, width=2)
            draw.text((bx + 25, cur_by + 30), title, fill=stroke_c, font=get_font(FONT_BOLD, 22))
            
            # Multi-line description
            words = desc.split()
            line1 = " ".join(words[:6])
            line2 = " ".join(words[6:])
            draw.text((bx + 25, cur_by + 90), line1, fill=(200, 210, 230), font=get_font(FONT_REGULAR, 20))
            draw.text((bx + 25, cur_by + 130), line2, fill=(200, 210, 230), font=get_font(FONT_REGULAR, 20))
            
    elif scene_idx == 1:
        # SCENE 2: A SOLUÇÃO - GAU v5 REVEAL
        draw_badge(draw, 60, 120, "NOVA GERAÇÃO // A REVOLUÇÃO COGNITIVA", get_font(FONT_BOLD, 20), (37, 211, 102), (37, 211, 102), (10, 35, 25), (37, 211, 102))
        
        # Big Title
        font_huge = get_font(FONT_BLACK, 84)
        draw.text((60, 200), "GAU v5", fill=(37, 211, 102), font=font_huge)
        
        font_sub = get_font(FONT_BOLD, 36)
        draw.text((60, 305), "GRANDE ARQUITETURA UNIFICADA", fill=(255, 255, 255), font=font_sub)
        
        font_lead = get_font(FONT_REGULAR, 26)
        draw.text((60, 370), "O Google Antigravity ganhou um sistema nervoso autônomo e verificável.", fill=(160, 185, 215), font=font_lead)
        
        # Center Avatar with pulsing rings
        av_size = 400
        av_resized = avatar_img.resize((av_size, av_size), Image.Resampling.LANCZOS)
        av_x = WIDTH - av_size - 140
        av_y = 230
        
        # Pulsing neon glow circle behind avatar
        pulse_r = int(av_size / 2 + 30 + 15 * math.sin(local_t * 4))
        center_ax = av_x + av_size // 2
        center_ay = av_y + av_size // 2
        draw.ellipse([center_ax - pulse_r, center_ay - pulse_r, center_ax + pulse_r, center_ay + pulse_r], outline=(37, 211, 102), width=3)
        
        img.paste(av_resized, (av_x, av_y), av_resized)
        
        # Stat Badges under text
        stats = [
            ("69", "MECANISMOS COGNITIVOS", (98, 230, 255)),
            ("16", "AGENTES ESPECIALISTAS", (255, 170, 50)),
            ("1", "COMANDO /GOAL NATIVO", (37, 211, 102)),
        ]
        stat_y = 480
        for i, (num, label, col) in enumerate(stats):
            sy = stat_y + i * 110
            draw.rounded_rectangle([60, sy, 720, sy + 85], radius=14, fill=(14, 20, 34), outline=col, width=2)
            draw.text((90, sy + 15), num, fill=col, font=get_font(FONT_BOLD, 42))
            draw.text((180, sy + 28), label, fill=(255, 255, 255), font=get_font(FONT_BOLD, 22))
            
    elif scene_idx == 2:
        # SCENE 3: O PODER E A ARQUITETURA
        draw_badge(draw, 60, 110, "ARQUITETURA // ENGENHARIA ORIENTADA POR PROVAS", get_font(FONT_BOLD, 20), (98, 230, 255), (98, 230, 255), (15, 25, 45), (98, 230, 255))
        
        # Left Side Avatar mini
        mini_size = 280
        mini_av = avatar_img.resize((mini_size, mini_size), Image.Resampling.LANCZOS)
        img.paste(mini_av, (80, 220), mini_av)
        
        draw.text((80, 530), "STATUS OPERACIONAL:", fill=(140, 160, 190), font=get_font(FONT_REGULAR, 18))
        draw.text((80, 560), "// COGNITIVE GATE READY", fill=(37, 211, 102), font=get_font(FONT_BOLD, 22))
        
        draw.text((80, 620), "PROVA E0 -> E5:", fill=(140, 160, 190), font=get_font(FONT_REGULAR, 18))
        draw.text((80, 650), "EVIDÊNCIA MATEMÁTICA ATIVA", fill=(98, 230, 255), font=get_font(FONT_BOLD, 20))
        
        # Right Side 3 Feature Cards
        card_x = 450
        card_w = WIDTH - card_x - 80
        card_h = 160
        cards = [
            ("16 SUBAGENTES ESPECIALIZADOS", "Arquitetos, Investigadores, Juízes Supremos e Swarms isolados trabalhando em paralelo.", (37, 211, 102)),
            ("ORQUESTRAÇÃO DO COMANDO /goal", "Roteamento inteligente de modelos, memória de falhas e orçamento rígido de compute.", (98, 230, 255)),
            ("TRIBUNAL DE CONCLUSÃO & ZERO BUGS", "Nenhum código é aceito sem testes de regressão, diff auditado e aprovação no Gate.", (180, 130, 255)),
        ]
        
        for i, (title, desc, col) in enumerate(cards):
            cy = 200 + i * (card_h + 30)
            draw.rounded_rectangle([card_x, cy, card_x + card_w, cy + card_h], radius=16, fill=(12, 17, 30), outline=col, width=2)
            draw.text((card_x + 35, cy + 25), title, fill=col, font=get_font(FONT_BOLD, 26))
            draw.text((card_x + 35, cy + 80), desc, fill=(210, 225, 245), font=get_font(FONT_REGULAR, 22))
            
        # Bottom Live Status Strip
        draw.rounded_rectangle([60, 880, WIDTH - 60, 960], radius=14, fill=(10, 15, 26), outline=(37, 211, 102), width=1)
        draw.text((100, 908), "CRITÉRIOS DE ACEITE:", fill=(140, 160, 190), font=get_font(FONT_BOLD, 20))
        draw.text((370, 908), "34/34 TESTES APROVADOS [OK]", fill=(37, 211, 102), font=get_font(FONT_BOLD, 22))
        draw.text((820, 908), "MEMÓRIA SQLITE WAL [OK]", fill=(98, 230, 255), font=get_font(FONT_BOLD, 22))
        draw.text((1220, 908), "TOLERÂNCIA ZERO A ALUCINAÇÃO [OK]", fill=(255, 215, 0), font=get_font(FONT_BOLD, 22))
        
    elif scene_idx == 3:
        # SCENE 4: CALL TO ACTION (ACESSE AGORA!)
        draw_centered_badge(draw, 70, "DISPONÍVEL AGORA PARA VOCÊ", get_font(FONT_BOLD, 22), (37, 211, 102), (37, 211, 102), (10, 45, 25), (37, 211, 102))
        
        # Massive Pulsing CTA Title
        pulse_scale = 1.0 + 0.03 * math.sin(local_t * 6)
        font_cta = get_font(FONT_BLACK, int(92 * pulse_scale))
        cta_text = "ACESSE AGORA!"
        draw_centered_text(draw, 155, cta_text, font_cta, (255, 255, 255))
        
        # The Main URL Box (Hyper-highlighted)
        box_w = 1160
        box_h = 175
        bx = (WIDTH - box_w) // 2
        by = 310
        draw.rounded_rectangle([bx, by, bx + box_w, by + box_h], radius=24, fill=(14, 26, 46), outline=(37, 211, 102), width=4)
        
        draw.text((bx + 60, by + 28), "SITE OFICIAL:", fill=(37, 211, 102), font=get_font(FONT_BOLD, 22))
        font_url = get_font(FONT_BLACK, 58)
        draw.text((bx + 60, by + 75), "gau-oficial.vercel.app", fill=(98, 230, 255), font=font_url)
        
        # Arrow CTA Button
        btn_w = 210
        btn_h = 75
        btn_x = bx + box_w - btn_w - 45
        btn_y = by + 50
        draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=14, fill=(37, 211, 102))
        btn_font = get_font(FONT_BOLD, 26)
        btn_bbox = btn_font.getbbox("ACESSAR >")
        btn_text_w = btn_bbox[2] - btn_bbox[0]
        draw.text((btn_x + (btn_w - btn_text_w) // 2, btn_y + 22), "ACESSAR >", fill=(5, 10, 20), font=btn_font)
        
        # Second Box: Official WhatsApp Channel
        wb_w = 1160
        wb_h = 140
        wx = (WIDTH - wb_w) // 2
        wy = 515
        draw.rounded_rectangle([wx, wy, wx + wb_w, wy + wb_h], radius=20, fill=(10, 30, 20), outline=(37, 211, 102), width=2)
        
        draw.text((wx + 45, wy + 25), "CANAL OFICIAL NO WHATSAPP (COMUNIDADE & ATUALIZAÇÕES):", fill=(255, 255, 255), font=get_font(FONT_BOLD, 20))
        draw.text((wx + 45, wy + 68), "whatsapp.com/channel/0029Vb97dV88vd1KJxutZh3V", fill=(37, 211, 102), font=get_font(FONT_BOLD, 30))
        
        # Third Box: GitHub Open Source & Package
        gb_w = 1160
        gb_h = 100
        gx = (WIDTH - gb_w) // 2
        gy = 685
        draw.rounded_rectangle([gx, gy, gx + gb_w, gy + gb_h], radius=16, fill=(14, 18, 28), outline=(140, 160, 190), width=1)
        draw.text((gx + 45, gy + 34), "CÓDIGO ABERTO & PACOTE MASTER NO GITHUB:", fill=(140, 160, 190), font=get_font(FONT_BOLD, 18))
        draw.text((gx + 560, gy + 30), "github.com/Joehott/GAU-v5", fill=(255, 255, 255), font=get_font(FONT_BOLD, 24))
        
        # Bottom Prompt / Ready line
        draw_centered_text(draw, 825, "Comece agora no Google Antigravity e eleve o nível da sua Inteligência Artificial!", get_font(FONT_BOLD, 24), (200, 220, 245))

    return img

def main():
    print("==================================================")
    print("🎬 GERADOR DE VÍDEO COMERCIAL OFICIAL DO GAU v5")
    print("==================================================")
    
    if not AVATAR_PATH.exists():
        print(f"ERRO: Avatar não encontrado em {AVATAR_PATH}")
        sys.exit(1)
        
    avatar_img = Image.open(AVATAR_PATH).convert('RGBA')
    
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    
    # 1. Generate Voiceovers
    audio_files, durations = asyncio.run(generate_voiceovers(TEMP_DIR))
    total_duration = sum(durations)
    print(f"\n-> Duração Total do Comercial: {total_duration:.2f} segundos (~{int(total_duration * FPS)} frames)")
    
    # 2. Synthesize Background Music
    bg_music_wav = TEMP_DIR / "bg_music.wav"
    synthesize_background_music(total_duration, bg_music_wav)
    
    # 3. Concatenate Scene Audios with exact timeline
    # Create concatenated voiceover with silence gaps
    print("[3/5] Montando mixagem de áudio com ffmpeg...")
    concat_list = TEMP_DIR / "concat_audio.txt"
    with open(concat_list, "w", encoding="utf-8") as f:
        for afile in audio_files:
            # ffmpeg concat format requires escaped paths or relative paths
            f.write(f"file '{afile.resolve().as_posix()}'\n")
            
    raw_voice_mp3 = TEMP_DIR / "voice_full.mp3"
    subprocess.run([
        'ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_list),
        '-c', 'copy', str(raw_voice_mp3)
    ], check=True, capture_output=True)
    
    # Mix voiceover with background music (ducking music to 18%)
    mixed_audio_mp3 = TEMP_DIR / "final_mixed_audio.mp3"
    subprocess.run([
        'ffmpeg', '-y',
        '-i', str(raw_voice_mp3),
        '-i', str(bg_music_wav),
        '-filter_complex',
        '[1:a]volume=0.18[music];[0:a]volume=1.2[voice];[voice][music]amix=inputs=2:duration=first:dropout_transition=2[aout]',
        '-map', '[aout]',
        '-c:a', 'libmp3lame', '-b:a', '192k',
        str(mixed_audio_mp3)
    ], check=True, capture_output=True)
    print("   -> Mixagem de voz e música concluída!")
    
    # 4. Render Video Frames directly to FFmpeg pipe
    print(f"[4/5] Renderizando animação gráfica Full HD 1080p a 30fps...")
    
    raw_video_mp4 = TEMP_DIR / "video_no_audio.mp4"
    
    ffmpeg_cmd = [
        'ffmpeg', '-y',
        '-f', 'rawvideo',
        '-vcodec', 'rawvideo',
        '-s', f'{WIDTH}x{HEIGHT}',
        '-pix_fmt', 'rgb24',
        '-r', str(FPS),
        '-i', '-',
        '-c:v', 'libx264',
        '-preset', 'fast',
        '-crf', '18',
        '-pix_fmt', 'yuv420p',
        str(raw_video_mp4)
    ]
    
    pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE)
    
    # Compute cumulative start times
    start_times = [0.0]
    for d in durations[:-1]:
        start_times.append(start_times[-1] + d)
        
    total_frames = int(total_duration * FPS)
    frame_count = 0
    
    for frame_idx in range(total_frames):
        global_t = frame_idx / float(FPS)
        
        # Determine scene
        curr_scene = 0
        for s_idx in range(len(durations)):
            if global_t >= start_times[s_idx]:
                curr_scene = s_idx
                
        local_t = global_t - start_times[curr_scene]
        scene_dur = durations[curr_scene]
        
        frame_img = render_frame(curr_scene, local_t, scene_dur, global_t, avatar_img)
        pipe.stdin.write(frame_img.tobytes())
        frame_count += 1
        
        if frame_count % 90 == 0 or frame_count == total_frames:
            percent = (frame_count / total_frames) * 100
            print(f"   -> Progresso da renderização: {frame_count}/{total_frames} frames ({percent:.1f}%)")
            
    pipe.stdin.close()
    pipe.wait()
    
    # 5. Final Mux: Combine Video + Audio into Production MP4
    print("[5/5] Finalizando vídeo comercial oficial...")
    subprocess.run([
        'ffmpeg', '-y',
        '-i', str(raw_video_mp4),
        '-i', str(mixed_audio_mp3),
        '-c:v', 'copy',
        '-c:a', 'aac', '-b:a', '192k',
        '-shortest',
        str(OUTPUT_MP4)
    ], check=True, capture_output=True)
    
    # Also copy to site downloads
    site_dl = ROOT / 'site' / 'downloads' / 'GAU_v5_Comercial_Oficial.mp4'
    shutil.copy2(OUTPUT_MP4, site_dl)
    
    # Clean up temp
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    
    file_size = OUTPUT_MP4.stat().st_size / (1024 * 1024)
    print("\n==================================================")
    print(f"🎉 SUCESSO ABSOLUTO! COMERCIAL CRIADO!")
    print(f"📍 Arquivo Salvo na Área de Trabalho:")
    print(f"   -> {OUTPUT_MP4} ({file_size:.2f} MB)")
    print(f"📍 Arquivo Salvo para o Site:")
    print(f"   -> {site_dl}")
    print("==================================================")

if __name__ == '__main__':
    main()
