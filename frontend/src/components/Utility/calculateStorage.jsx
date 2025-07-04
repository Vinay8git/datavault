const parseSizeToBytes = (sizeStr) => {
  const [value, unit] = sizeStr.split(" ");
  const num = parseFloat(value);
  switch (unit.toUpperCase()) {
    case "KB":
      return num * 1024;
    case "MB":
      return num * 1024 * 1024;
    case "GB":
      return num * 1024 * 1024 * 1024;
    default:
      return 0;
  }
};

const formatBytes = (bytes) => {
  if (bytes >= 1024 ** 3) {
    return (bytes / 1024 ** 3).toFixed(2) + " GB";
  } else if (bytes >= 1024 ** 2) {
    return (bytes / 1024 ** 2).toFixed(2) + " MB";
  } else {
    return (bytes / 1024).toFixed(2) + " KB";
  }
};

const calculateStorage = (files) => {
  const totals = {
    document: 0,
    image: 0,
    media: 0,
    other: 0,
  };

  for (const file of files) {
    const bytes = parseSizeToBytes(file.size);
    if (totals[file.type] !== undefined) {
      totals[file.type] += bytes;
    } else {
      totals.other += bytes;
    }
  }

  const totalUsed = Object.values(totals).reduce((a, b) => a + b, 0);
  const totalAvailable = 128 * 1024 * 1024 * 1024; // 128 GB
  const available = totalAvailable - totalUsed;

  return {
    used: formatBytes(totalUsed),
    available: formatBytes(available),
    document: formatBytes(totals.document),
    image: formatBytes(totals.image),
    media: formatBytes(totals.media),
    other: formatBytes(totals.other),
  };
};

export default calculateStorage;