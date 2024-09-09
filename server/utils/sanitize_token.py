def sanitize_token(token: str, visible_start: int = 4, visible_end: int = 4, max_mask_length: int = 12) -> str:
    """
    Sanitizes a token by masking its middle characters with asterisks (*) while keeping
    a specified number of characters visible at the beginning and end. The masked section
    will be limited to a maximum length.

    Args:
        token (str): The token to be sanitized.
        visible_start (int): Number of characters to keep visible at the start. Default is 4.
        visible_end (int): Number of characters to keep visible at the end. Default is 4.
        max_mask_length (int): Maximum number of asterisks to use for the masked section. Default is 12.

    Returns:
        str: The sanitized token.
    """
    if not token or len(token) <= visible_start + visible_end:
        return token

    # Calculate the length of the masked section
    masked_length = len(token) - visible_start - visible_end

    # Limit the masked section to the maximum mask length
    if masked_length > max_mask_length:
        masked_length = max_mask_length

    masked_section = '*' * masked_length
    return token[:visible_start] + masked_section + token[-visible_end:]
