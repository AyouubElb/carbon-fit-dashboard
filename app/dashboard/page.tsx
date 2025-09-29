import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  Plus,
  Clock,
  ArrowRight,
} from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
          Bienvenue dans votre tableau de bord
        </h2>
        <p className="text-lg text-muted-foreground font-medium">
          Gérez votre boutique de t-shirts automobiles en toute simplicité
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-indigo-700">
              Total Produits
            </CardTitle>
            <div className="p-2 bg-indigo-100 rounded-xl shadow-sm">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900 mb-1">24</div>
            <p className="text-sm text-indigo-600 font-medium">+2 ce mois-ci</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">
              Commandes
            </CardTitle>
            <div className="p-2 bg-blue-100 rounded-xl shadow-sm">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-1">142</div>
            <p className="text-sm text-blue-600 font-medium">
              +12 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-emerald-700">
              Revenus
            </CardTitle>
            <div className="p-2 bg-emerald-100 rounded-xl shadow-sm">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 mb-1">
              €3,420
            </div>
            <p className="text-sm text-emerald-600 font-medium">
              +8% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 via-white to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">
              Clients
            </CardTitle>
            <div className="p-2 bg-purple-100 rounded-xl shadow-sm">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-1">89</div>
            <p className="text-sm text-purple-600 font-medium">
              +5 nouveaux clients
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-white via-indigo-50/30 to-white border-indigo-200 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              Actions rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-between h-14 bg-gradient-to-r from-white to-indigo-50/50 hover:from-indigo-50 hover:to-indigo-100 border border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-indigo-100 rounded-xl">
                  <Package className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Ajouter un nouveau produit
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-indigo-600" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-14 bg-gradient-to-r from-white to-blue-50/50 hover:from-blue-50 hover:to-blue-100 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-blue-100 rounded-xl">
                  <ShoppingCart className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Voir les commandes en attente
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-blue-600" />
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between h-14 bg-gradient-to-r from-white to-emerald-50/50 hover:from-emerald-50 hover:to-emerald-100 border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-emerald-100 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  Gérer l&apos;inventaire
                </span>
              </div>
              <ArrowRight className="h-5 w-5 text-emerald-600" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white via-gray-50/30 to-white border-gray-200 shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              Activité récente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-green-50/50 rounded-xl border border-green-200 shadow-sm">
              <div className="p-2.5 bg-green-100 rounded-xl shadow-sm">
                <ShoppingCart className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">
                  Nouvelle commande #1234
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Il y a 2 heures
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-blue-200 shadow-sm">
              <div className="p-2.5 bg-blue-100 rounded-xl shadow-sm">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">
                  Produit &quot;T-shirt BMW&quot; ajouté
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Il y a 1 jour
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-white to-purple-50/50 rounded-xl border border-purple-200 shadow-sm">
              <div className="p-2.5 bg-purple-100 rounded-xl shadow-sm">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900">
                  Commande #1233 expédiée
                </p>
                <p className="text-xs text-gray-600 font-medium">
                  Il y a 2 jours
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
