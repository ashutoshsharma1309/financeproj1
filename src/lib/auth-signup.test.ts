import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth";

const reset = () => useAuthStore.setState({ user: null, token: null, users: [] });

describe("auth store — signup", () => {
  beforeEach(reset);

  it("makes the first account an OWNER and signs them in", () => {
    const r = useAuthStore.getState().signup({
      name: "Ada",
      email: "Ada@Example.com",
      password: "longenough",
    });
    expect(r.ok).toBe(true);
    const state = useAuthStore.getState();
    expect(state.user?.role).toBe("OWNER");
    // Email is normalized to lower-case.
    expect(state.user?.email).toBe("ada@example.com");
    expect(state.token).toBeTruthy();
  });

  it("makes a second, distinct account an EMPLOYEE", () => {
    const s = useAuthStore.getState();
    s.signup({ name: "Ada", email: "ada@x.com", password: "longenough" });
    s.signup({ name: "Grace", email: "grace@x.com", password: "longenough" });
    const grace = useAuthStore.getState().users.find((u) => u.email === "grace@x.com");
    expect(grace?.role).toBe("EMPLOYEE");
  });

  it("rejects a duplicate email", () => {
    const s = useAuthStore.getState();
    s.signup({ name: "Ada", email: "ada@x.com", password: "longenough" });
    const r = s.signup({ name: "Imposter", email: "ada@x.com", password: "longenough" });
    expect(r.ok).toBe(false);
  });

  it("never exposes the password hash on the public user", () => {
    useAuthStore.getState().signup({ name: "Ada", email: "ada@x.com", password: "longenough" });
    const user = useAuthStore.getState().user as unknown as Record<string, unknown>;
    expect(user.passwordHash).toBeUndefined();
  });
});
