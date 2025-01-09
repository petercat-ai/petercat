# 检查是否激活了虚拟环境
if [ -z "$VIRTUAL_ENV" ]; then
  # 如果没有激活，找到虚拟环境并执行激活
  VENV_PATH=$(find . -type d -name "venv" -maxdepth 2)
  if [ -n "$VENV_PATH" ]; then
    source "$VENV_PATH/bin/activate"
  else
    echo "venv directory not found. Creating a new virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
  fi
fi

pip3 install -r requirements.txt