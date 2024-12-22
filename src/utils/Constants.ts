

  // Format address to show only first 8 and last 7 characters
  export const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 8)}...${addr.slice(-7)}`
  }