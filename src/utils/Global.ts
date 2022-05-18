const handleAdditionalParams = (params: string): Record<string, string> => {
  const result: Record<string, string> = {};
  const paramsArray = params.split(' ');
  paramsArray.forEach(param => {
    const paramParts = param.split('=');
    if (paramParts.length !== 2) return;
    result[paramParts[0]] = paramParts[1];
  });
  return result;
}

export { handleAdditionalParams };