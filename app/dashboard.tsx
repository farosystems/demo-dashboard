"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "./components/app-sidebar"
import { DashboardSection } from "./components/dashboard-section"
import { ProductosSection } from "./components/productos-section"
import { CategoriasSection } from "./components/categorias-section"
import { MarcasSection } from "./components/marcas-section"
import { ZonasSection } from "./components/zonas-section"
import { StockSucursalesSection } from "./components/stock-sucursales-section"
import { PlanesSection } from "./components/planes-section"
import { ProductosPlanSection } from "./components/productos-plan-section"
import { ProductosPlanesSection } from "./components/productos-planes-section"
import { ConfiguracionZonas } from "./components/configuracion-zonas"
import { BannerConfig } from "./components/banner-config"
import { LogoConfig } from "./components/logo-config"
import { ConfiguracionAgenteSection } from "./components/configuracion-agente-section"
import { ClientesSection } from "./components/clientes-section"
import { PedidosSection } from "./components/pedidos-section"
import { ClientesWebSection } from "./components/clientes-web-section"
import { useSupabaseData } from "./hooks/use-supabase-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserButton, useUser } from "@clerk/nextjs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function Dashboard() {
  const { user, isLoaded } = useUser()
  const [activeSection, setActiveSection] = useState("dashboard")
  const { 
    productos, 
    planes, 
    productosPorPlan, 
    productosPorPlanDefault,
    categorias,
    marcas,
    zonas,
    clientes,
    pedidos,
    clientesWeb,
    stockSucursales,
    configuracion,
    configuracionZonas,
    configuracionWeb,
    loading, 
    error,
    createProducto,
    updateProducto,
    deleteProducto,
    getPlanesAsociados,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    createMarca,
    updateMarca,
    deleteMarca,
    createZona,
    updateZona,
    deleteZona,
    createCliente,
    updateCliente,
    deleteCliente,
    createPedido,
    updatePedido,
    deletePedido,
    createClienteWeb,
    updateClienteWeb,
    deleteClienteWeb,
    createStockSucursal,
    updateStockSucursal,
    deleteStockSucursal,
    importStockSucursales,
    createConfiguracionZona,
    updateConfiguracionZona,
    deleteConfiguracionZona,
    createPlan,
    updatePlan,
    deletePlan,
    syncPlanAssociationsStatus,
    createProductoPlan,
    updateProductoPlan,
    deleteProductoPlan,
    createProductoPlanDefault,
    updateProductoPlanDefault,
    deleteProductoPlanDefault,
    getCategoriasDePlan,
    updateConfiguracion,
    updateConfiguracionWeb,
    refreshData
  } = useSupabaseData()

  // Escuchar cambios en los hash de la URL
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        setActiveSection(hash)
      }
    }

    window.addEventListener("hashchange", handleHashChange)
    handleHashChange() // Ejecutar al cargar

    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  // Si Clerk aún está cargando, mostrar loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verificando autenticación...</div>
      </div>
    )
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    // Usar useEffect para redirección del lado del cliente
    useEffect(() => {
      const timer = setTimeout(() => {
        window.location.href = '/sign-in'
      }, 1000)
      
      return () => clearTimeout(timer)
    }, [])
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div className="text-lg">Redirigiendo al login...</div>
        </div>
      </div>
    )
  }

  const getSectionTitle = () => {
    switch (activeSection) {
      case "productos":
        return "Productos"
      case "categorias":
        return "Categorías"
      case "marcas":
        return "Marcas"
      case "zonas":
        return "Zonas"
      case "planes":
        return "Planes de Financiación"
      case "productos-plan":
        return "Planes Especiales"
      case "productos-planes":
        return "Productos por Planes"
      case "clientes-web":
        return "Clientes Web"
      case "configuracion":
        return "Configuración Web"
      case "agente-configuracion":
        return "Configuración del Agente"
      case "agente-clientes":
        return "Clientes"
      case "agente-pedidos":
        return "Pedidos"
      default:
        return "Dashboard"
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Cargando datos...</div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      )
    }

    switch (activeSection) {
      case "productos":
        return (
          <ProductosSection 
            productos={productos} 
            categorias={categorias}
            marcas={marcas}
            onCreateProducto={createProducto}
            onUpdateProducto={updateProducto}
            onDeleteProducto={deleteProducto}
          />
        )
      case "categorias":
        return (
          <CategoriasSection 
            categorias={categorias} 
            onCreateCategoria={createCategoria}
            onUpdateCategoria={updateCategoria}
            onDeleteCategoria={deleteCategoria}
          />
        )
      case "marcas":
        return (
          <MarcasSection 
            marcas={marcas} 
            onCreateMarca={createMarca}
            onUpdateMarca={updateMarca}
            onDeleteMarca={deleteMarca}
          />
        )
      case "zonas":
        return (
          <ZonasSection 
            zonas={zonas} 
            onCreateZona={createZona}
            onUpdateZona={updateZona}
            onDeleteZona={deleteZona}
          />
        )
      case "stock-sucursales":
        return (
          <StockSucursalesSection 
            stockSucursales={stockSucursales}
            productos={productos}
            zonas={zonas}
            onCreateStockSucursal={createStockSucursal}
            onUpdateStockSucursal={updateStockSucursal}
            onDeleteStockSucursal={deleteStockSucursal}
            onImportStockSucursales={importStockSucursales}
          />
        )
      case "planes":
        return (
          <PlanesSection 
            planes={planes} 
            categorias={categorias}
            onCreatePlan={createPlan}
            onUpdatePlan={updatePlan}
            onDeletePlan={deletePlan}
            getCategoriasDePlan={getCategoriasDePlan}
            syncPlanAssociationsStatus={syncPlanAssociationsStatus}
          />
        )
      case "productos-plan":
        return (
          <ProductosPlanSection
            productos={productos}
            planes={planes}
            productosPorPlan={productosPorPlan}
            onCreateProductoPlan={createProductoPlan}
            onUpdateProductoPlan={updateProductoPlan}
            onDeleteProductoPlan={deleteProductoPlan}
            onUpdateProducto={updateProducto}
          />
        )
      case "productos-planes":
        return (
          <ProductosPlanesSection
            productosPlanesDefault={productosPorPlanDefault}
            productos={productos}
            planes={planes}
            onCreateProductoPlanDefault={createProductoPlanDefault}
            onUpdateProductoPlanDefault={updateProductoPlanDefault}
            onDeleteProductoPlanDefault={deleteProductoPlanDefault}
          />
        )
      case "clientes-web":
        return (
          <ClientesWebSection 
            clientesWeb={clientesWeb}
            onCreateClienteWeb={createClienteWeb}
            onUpdateClienteWeb={updateClienteWeb}
            onDeleteClienteWeb={deleteClienteWeb}
          />
        )
      case "configuracion":
        return (
          <div className="space-y-6">
            <LogoConfig
              configuracion={configuracion}
              onUpdateConfiguracion={updateConfiguracion}
            />
            <BannerConfig
              configuracionWeb={configuracionWeb}
              onUpdateConfiguracionWeb={updateConfiguracionWeb}
            />
            <ConfiguracionZonas
              zonas={zonas}
              configuracionZonas={configuracionZonas}
              onCreateConfiguracionZona={createConfiguracionZona}
              onUpdateConfiguracionZona={updateConfiguracionZona}
              onDeleteConfiguracionZona={deleteConfiguracionZona}
            />
          </div>
        )
      case "agente-configuracion":
        return <ConfiguracionAgenteSection />
      case "agente-clientes":
        return (
          <ClientesSection 
            clientes={clientes}
            zonas={zonas}
            onCreateCliente={createCliente}
            onUpdateCliente={updateCliente}
            onDeleteCliente={deleteCliente}
          />
        )
      case "agente-pedidos":
        return (
          <PedidosSection 
            pedidos={pedidos}
            clientes={clientes}
            onCreatePedido={createPedido}
            onUpdatePedido={updatePedido}
            onDeletePedido={deletePedido}
            onViewPedidoDetails={(pedido) => pedido}
          />
        )
      default:
        return <DashboardSection productos={productos} planes={planes} productosPorPlan={productosPorPlan} />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar configuracion={configuracion} activeSection={activeSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#dashboard">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{getSectionTitle()}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Dashboard
