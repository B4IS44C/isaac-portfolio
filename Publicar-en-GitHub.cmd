@echo off
setlocal
cd /d "%~dp0"
echo === Publicar portafolio en B4IS44C/isaac-portfolio ===
echo.
gh api user --jq .login > "%TEMP%\isaac-portfolio-account.txt"
if errorlevel 1 goto auth_error
set /p portfolio_account=<"%TEMP%\isaac-portfolio-account.txt"
if /i not "%portfolio_account%"=="B4IS44C" goto wrong_account
git remote get-url origin >nul 2>nul
if not errorlevel 1 goto check_remote
gh repo view B4IS44C/isaac-portfolio >nul 2>nul
if not errorlevel 1 goto existing_repo
gh repo create B4IS44C/isaac-portfolio --public --source . --remote origin --description "Portafolio interactivo de Isaac Hidalgo: full stack, mobile y sistemas"
if errorlevel 1 goto failed
:check_remote
git remote get-url origin > "%TEMP%\isaac-portfolio-remote.txt"
if errorlevel 1 goto wrong_remote
set /p portfolio_remote=<"%TEMP%\isaac-portfolio-remote.txt"
if /i "%portfolio_remote%"=="https://github.com/B4IS44C/isaac-portfolio.git" goto remote_ok
if /i "%portfolio_remote%"=="https://github.com/B4IS44C/isaac-portfolio" goto remote_ok
goto wrong_remote
:remote_ok
git push -u origin main
if errorlevel 1 goto failed
gh api repos/B4IS44C/isaac-portfolio/pages >nul 2>nul
if not errorlevel 1 goto deploy
gh api --method POST repos/B4IS44C/isaac-portfolio/pages -f build_type=workflow
if errorlevel 1 goto failed
:deploy
gh workflow run pages.yml --ref main --repo B4IS44C/isaac-portfolio
if errorlevel 1 goto failed
echo.
echo Codigo publicado. GitHub Actions esta preparando el sitio.
echo Sitio: https://b4is44c.github.io/isaac-portfolio/
echo Estado: https://github.com/B4IS44C/isaac-portfolio/actions
start "" "https://github.com/B4IS44C/isaac-portfolio/actions"
pause
exit /b 0
:auth_error
echo No se pudo confirmar la sesion. Ejecuta gh auth login y vuelve a intentar.
goto failed
:wrong_account
echo La cuenta activa no es B4IS44C. Ejecuta gh auth switch --user B4IS44C.
goto failed
:existing_repo
echo Ya existe B4IS44C/isaac-portfolio. Se detuvo para no modificar otro trabajo.
goto failed
:wrong_remote
echo El remoto origin no coincide con el repositorio esperado. No se publicaron cambios.
:failed
echo.
echo No se completo la publicacion. Comparte el error visible para revisarlo.
pause
exit /b 1
