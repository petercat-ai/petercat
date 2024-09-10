import re

def convert_patch_to_hunk(diff):
    if not diff:
        return ''
    old_line, new_line = 0, 0
    result = []

    for line in diff.splitlines():
        if line.startswith('@@'):
            # 使用正则表达式提取旧文件和新文件的起始行号
            match = re.search(r'@@ -(\d+),?\d* \+(\d+),?\d* @@', line)
            if match:
                old_line = int(match.group(1))
                new_line = int(match.group(2))
            continue  # 跳过 @@ 行的输出
        elif line.startswith('-'):
            result.append(f"      {old_line:<5} {line}")  # 仅旧文件有内容
            old_line += 1
        elif line.startswith('+'):
            result.append(f"{new_line:<5}       {line}")  # 仅新文件有内容
            new_line += 1
        else:
            result.append(f"{new_line:<5} {old_line:<5} {line}")  # 两边都有的内容
            old_line += 1
            new_line += 1

    return "NewFile OldFile SourceCode \n" + "\n".join(result)