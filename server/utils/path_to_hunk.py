def convert_patch_to_hunk(patch: str) -> str:
    if patch is None:
        return ""
    # 将 patch 按行拆分
    lines = patch.strip().split('\n')
    
    new_hunk = []
    old_hunk = []
    
    new_line_num = None
    old_line_num = None
    
    for line in lines:
        if line.startswith('@@'):
            # 获取 old 和 new 的起始行号
            parts = line.split()
            old_line_num = int(parts[1].split(',')[0][1:])
            new_line_num = int(parts[2].split(',')[0][1:])
        elif line.startswith('+'):
            # 新增行
            new_hunk.append(f"{new_line_num}: {line[1:]}")
            new_line_num += 1
        elif line.startswith('-'):
            # 删除行
            old_hunk.append(line[1:])
            old_line_num += 1
        else:
            # 不变行
            new_hunk.append(f"{new_line_num}: {line}")
            old_hunk.append(line)
            new_line_num += 1
            old_line_num += 1
    
    # 格式化输出
    result = []
    result.append('---new_hunk---')
    result.extend(new_hunk)
    result.append('---old_hunk---')
    result.extend(old_hunk)
    
    return '\n'.join(result)