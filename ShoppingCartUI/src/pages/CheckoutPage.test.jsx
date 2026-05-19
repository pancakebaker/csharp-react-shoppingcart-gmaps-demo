import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/renderWithProviders";
import CheckoutPage from "./CheckoutPage";

vi.mock("@react-google-maps/api", () => ({
  GoogleMap: ({ children }) => <div data-testid="google-map">{children}</div>,
  MarkerF: () => <div data-testid="map-marker" />,
  useJsApiLoader: () => ({ isLoaded: true, loadError: null }),
}));

const cartItems = [
  {
    product: {
      id: 1,
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse",
      price: 799,
      imageUrl: "https://example.com/mouse.jpg",
    },
    qty: 1,
  },
];

describe("CheckoutPage", () => {
  it("renders checkout form", () => {
    vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "test-key");

    renderWithProviders(<CheckoutPage />, {
      route: "/checkout",
      cartItems,
    });

    expect(screen.getByRole("heading", { name: /checkout/i }))
      .toBeInTheDocument();

    expect(screen.getByRole("button", { name: /place order/i }))
      .toBeInTheDocument();
  });
});
