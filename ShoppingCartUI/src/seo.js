const DEFAULT_TITLE = "C# React Shopping Cart Demo";
const DEFAULT_DESCRIPTION =
  "A full-stack ASP.NET Core and React shopping cart demo with product browsing, cart state, checkout, Google Maps delivery pin selection, and automated tests.";

export function setPageMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
} = {}) {
  document.title = title;

  const descriptionMeta = document.querySelector('meta[name="description"]');
  if (descriptionMeta) {
    descriptionMeta.setAttribute("content", description);
  }
}
