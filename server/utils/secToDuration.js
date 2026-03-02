// Helper function to convert total seconds to a human-friendly duration string
function convertSecondsToDuration(totalSeconds) {
  const secs = Number(totalSeconds)
  if (!Number.isFinite(secs) || secs <= 0) {
    return "0s"
  }

  const hours = Math.floor(secs / 3600)
  const minutes = Math.floor((secs % 3600) / 60)
  const seconds = Math.floor(secs % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

module.exports = {
  convertSecondsToDuration,
}