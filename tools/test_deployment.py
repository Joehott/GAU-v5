import json
import hashlib
from pathlib import Path

root = Path('.').resolve()

# 1. vercel.json at root
root_vercel = json.loads((root / 'vercel.json').read_text(encoding='utf-8'))
assert root_vercel.get('cleanUrls') is True, 'cleanUrls missing or not True'
assert len(root_vercel.get('headers', [])) > 0, 'headers missing'
assert len(root_vercel.get('rewrites', [])) > 0, 'rewrites missing'
print('Test 1 Passed: root vercel.json is valid')

# 2. site/vercel.json
site_vercel = json.loads((root / 'site' / 'vercel.json').read_text(encoding='utf-8'))
assert site_vercel.get('cleanUrls') is True, 'site cleanUrls missing'
assert len(site_vercel.get('headers', [])) > 0, 'site headers missing'
print('Test 2 Passed: site/vercel.json is valid')

# 3. root index.html
root_index = (root / 'index.html').read_text(encoding='utf-8')
assert 'http-equiv="refresh"' in root_index, 'meta refresh missing'
assert 'url=site/' in root_index, 'meta refresh target missing'
assert 'window.location.replace' in root_index, 'window.location.replace missing'
assert 'href="site/"' in root_index, 'link to site/ missing'
print('Test 3 Passed: root index.html contains immediate redirection and fallback')

# 4. site/index.html assets
site_index = (root / 'site' / 'index.html').read_text(encoding='utf-8')
expected_files = [
    'styles.css',
    'app.js',
    'ideas.js',
    'assets/favicon.svg',
    'assets/gau-mark.svg',
    'site.webmanifest',
    'downloads/GAU-v5.zip',
    'downloads/GAU-v5.zip.sha256',
]
for f in expected_files:
    p = root / 'site' / f
    assert p.exists(), f'site asset {f} does not exist at {p}'
print('Test 4 Passed: All site assets referenced in site/index.html exist')

# 5. install scripts at root and site
for script in ['install.ps1', 'install.sh']:
    assert (root / script).exists(), f'Root {script} missing'
    assert (root / 'site' / script).exists(), f'site {script} missing'
    assert (root / 'downloads' / script).exists(), f'downloads {script} missing'
    assert (root / 'site' / 'downloads' / script).exists(), f'site/downloads {script} missing'
print('Test 5 Passed: install.ps1 and install.sh present at all root and site paths')

# 6. GAU-v5.zip checksums
sha_expected = (root / 'site' / 'downloads' / 'GAU-v5.zip.sha256').read_text(encoding='utf-8').split()[0]
for zpath in [root / 'site' / 'downloads' / 'GAU-v5.zip', root / 'downloads' / 'GAU-v5.zip', root / 'dist' / 'GAU-v5.zip']:
    assert zpath.exists(), f'Zip {zpath} does not exist'
    sha_calc = hashlib.sha256(zpath.read_bytes()).hexdigest()
    assert sha_calc == sha_expected, f'Checksum mismatch for {zpath}: {sha_calc} != {sha_expected}'
print(f'Test 6 Passed: Checksums match perfectly ({sha_expected[:16]}...)')

# 7. .nojekyll
assert (root / '.nojekyll').exists(), '.nojekyll missing'
print('Test 7 Passed: .nojekyll present')

print('\nALL 7 INTEGRITY AND DEPLOYMENT CHECKS PASSED!')
