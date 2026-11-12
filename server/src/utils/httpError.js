// Error with a message that is safe to show to the user.
// status = HTTP status, code = short machine-readable code the frontend can react to.
export function httpError(status, message, code) {
  const err = new Error(message)
  err.status = status
  err.expose = true
  if (code) err.publicCode = code
  return err
}
