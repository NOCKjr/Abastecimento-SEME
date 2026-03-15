import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../auth/auth";
import { usuarioApi } from "../api/usuarioApi";
import type { Usuario } from "../types/models";

type Props = {
  allow: (me: Usuario) => boolean;
  children: React.ReactElement;
};

export function RequirePermission({ allow, children }: Props) {
  const [me, setMe] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) return;

    usuarioApi
      .me()
      .then((res) => setMe(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (loading) return null;
  if (!me) return <Navigate to="/login" replace />;
  if (!allow(me)) return <Navigate to="/home" replace />;

  return children;
}

