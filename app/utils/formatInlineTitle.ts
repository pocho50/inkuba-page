export const formatInlineTitle = (value?: string) => {
  if (!value) {
    return "";
  }

  return value.replace(
    /\[([^\]]+)\]\{\.([^}]+)\}/g,
    '<span class="$2">$1</span>',
  );
};
