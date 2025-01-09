import importlib.util
import os
import sys
import logging

from core.config import settings
from interface.db_plugin_interface import DBPluginInterface


def singleton(cls):
    """
    单例装饰器
    """
    _instance = {}

    def _singleton(*args, **kwargs):
        if cls not in _instance:
            _instance[cls] = cls(*args, **kwargs)
        return _instance[cls]

    return _singleton


@singleton
class PluginManager:
    """
    插件管理器
    1. 读取插件目录下的所有插件
    2. 检查每个插件是否实现了DBPluginInterface接口
    3. 如果实现了，则将该插件设置为当前插件
    """

    pluginPath = None
    dbPlugin = None

    def __init__(self, PluginsAbsPath=None):
        self.load_plugins(PluginsAbsPath)

    def _load_module(self, module_name, module_path):
        try:
            spec = importlib.util.spec_from_file_location(module_name, module_path)
            module = importlib.util.module_from_spec(spec)
            sys.modules[module_name] = module
            spec.loader.exec_module(module)
            return module
        except Exception as e:
            logging.error(
                f"Failed to load module '{module_name}' from '{module_path}': {e}"
            )
            raise e

    def _check_and_set_plugin(self, module):
        for name, obj in module.__dict__.items():
            if (
                isinstance(obj, type)
                and issubclass(obj, DBPluginInterface)
                and obj is not DBPluginInterface
            ):
                print(f"Found plugin class: {name}")
                self.dbPlugin = obj(settings)
                return True
        return False

    def load_plugins(self, pluginAbsPath):
        plugins_dir = os.path.join(pluginAbsPath, "plugins")
        self.pluginPath = plugins_dir
        print("plugins_dir", plugins_dir)
        for root, _, files in os.walk(plugins_dir):
            for file in files:
                if file.endswith(".py"):
                    module_path = os.path.join(root, file)
                    module_name = os.path.splitext(file)[0]
                    try:
                        module = self._load_module(module_name, module_path)
                        if self._check_and_set_plugin(module):
                            print(f"Loaded plugin from '{module_path}'")
                            # 找到一个插件并设置后退出
                            return

                    except Exception as e:
                        logging.error(
                            f"Failed to load plugin from '{module_path}': {e}"
                        )
                        continue

    @classmethod
    def get_db_plugin(cls):
        if cls.dbPlugin is None:
            raise Exception("No plugin loaded")
        return cls.dbPlugin
