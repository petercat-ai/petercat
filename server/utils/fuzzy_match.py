import difflib


def contains_keyword_fuzzy(text, keywords, cutoff=0.8):
    text_lower = text.lower()
    for keyword in keywords:
        keyword_lower = keyword.lower()
        len_keyword = len(keyword_lower)

        for i in range(len(text_lower) - len_keyword + 1):
            substring = text_lower[i : i + len_keyword]
            matcher = difflib.SequenceMatcher(None, keyword_lower, substring)
            if matcher.ratio() >= cutoff:
                return True
    return False
