/**
 * Maliit na tagapagbuklod ng className.
 * Ginagamit para hindi magdikit-dikit ang mga kondisyonal na class.
 */
export function cx(...values) {
  return values.filter(Boolean).join(" ");
}
