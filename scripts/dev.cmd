@echo off
cd /d "%~dp0.."
set PATH=C:\Users\Asus\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;%PATH%
"C:\Users\Asus\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" ".\node_modules\next\dist\bin\next" dev --hostname 0.0.0.0 --port 3000
