import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth";

const reset = () => useAuthStore.setState({ user: null, token: null, users: [] });

function register() {
  useAuthStore.getState().signup({ name: "Ada", email: "ada@x.com", password: "longenough" });
}

describe("auth store — session", () => {
  beforeEach(reset);

  it("logs in with correct credentials", () => {
    register();
    useAuthStore.getState().logout();
    const r = useAuthStore.getState().login({ email: "ada@x.com", password: "longenough" });
    expect(r.ok).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe("ada@x.com");
  });

  it("rejects a wrong password", () => {
    register();
    useAuthStore.getState().logout();
    const r = useAuthStore.getState().login({ email: "ada@x.com", password: "wrongpass" });
    expect(r.ok).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("logout clears the session but keeps the user registry", () => {
    register();
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.users).toHaveLength(1);
  });

  it("requestPasswordReset does not reveal whether an email exists", () => {
    register();
    expect(useAuthStore.getState().requestPasswordReset("ada@x.com").ok).toBe(true);
    expect(useAuthStore.getState().requestPasswordReset("nobody@x.com").ok).toBe(true);
  });

  it("updateProfile patches the signed-in user and the registry", () => {
    register();
    useAuthStore.getState().updateProfile({ name: "Ada Lovelace" });
    const state = useAuthStore.getState();
    expect(state.user?.name).toBe("Ada Lovelace");
    expect(state.users[0].name).toBe("Ada Lovelace");
  });
});
