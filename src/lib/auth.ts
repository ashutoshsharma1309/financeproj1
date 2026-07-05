"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "./utils";
import type { Role } from "./types";

// ─────────────────────────────────────────────────────────────
// Client-side auth store (stand-in).
//
// This mirrors the shape of a real JWT/session backend so the UI flows
// (signup, login, logout, protected routes, RBAC) are fully functional in
// the hackathon build. To go to production, replace the three service
// methods below with calls to your API — the component layer never touches
// storage directly, so no UI changes are required.
//
//   POST /api/auth/signup  → { user, token }
//   POST /api/auth/login   → { user, token }
//   POST /api/auth/logout
//
// Passwords here are obfuscated with a non-cryptographic hash purely so the
// demo never stores plaintext. Real hashing (argon2/bcrypt) belongs on the
// server; see src/lib/security.ts for the intended boundary.
// ─────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

function weakHash(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return `h${(h >>> 0).toString(36)}`;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  users: StoredUser[]; // local registry — server-side in production
  signup: (input: {
    name: string;
    email: string;
    password: string;
  }) => { ok: true } | { ok: false; error: string };
  login: (input: {
    email: string;
    password: string;
  }) => { ok: true } | { ok: false; error: string };
  logout: () => void;
  requestPasswordReset: (email: string) => { ok: boolean };
  updateProfile: (patch: Partial<Pick<AuthUser, "name" | "avatarUrl">>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      users: [],

      signup: ({ name, email, password }) => {
        const normalized = email.toLowerCase().trim();
        if (get().users.some((u) => u.email === normalized)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const isFirst = get().users.length === 0;
        const stored: StoredUser = {
          id: uid("usr"),
          name: name.trim(),
          email: normalized,
          role: isFirst ? "OWNER" : "EMPLOYEE",
          emailVerified: false,
          createdAt: new Date().toISOString(),
          passwordHash: weakHash(password),
        };
        const { passwordHash, ...pub } = stored;
        void passwordHash;
        set((s) => ({
          users: [...s.users, stored],
          user: pub,
          token: uid("tok"),
        }));
        return { ok: true };
      },

      login: ({ email, password }) => {
        const normalized = email.toLowerCase().trim();
        const found = get().users.find((u) => u.email === normalized);
        if (!found || found.passwordHash !== weakHash(password)) {
          return { ok: false, error: "Invalid email or password." };
        }
        const { passwordHash, ...pub } = found;
        void passwordHash;
        set({ user: pub, token: uid("tok") });
        return { ok: true };
      },

      logout: () => set({ user: null, token: null }),

      requestPasswordReset: (email) => {
        const exists = get().users.some(
          (u) => u.email === email.toLowerCase().trim(),
        );
        // Always report success to avoid leaking which emails are registered.
        return { ok: exists || true };
      },

      updateProfile: (patch) =>
        set((s) => {
          if (!s.user) return {};
          const updated = { ...s.user, ...patch };
          return {
            user: updated,
            users: s.users.map((u) =>
              u.id === updated.id ? { ...u, ...patch } : u,
            ),
          };
        }),
    }),
    { name: "aicfo-auth", version: 1 },
  ),
);
