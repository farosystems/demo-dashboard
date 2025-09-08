"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Search, Users, Phone, Mail, Filter, ChevronLeft, ChevronRight, Eye, Edit } from "lucide-react"
import { ClienteWeb } from "@/lib/supabase"

interface ClientesWebSectionProps {
  clientesWeb: ClienteWeb[]
  onCreateClienteWeb?: (clienteWeb: Omit<ClienteWeb, 'id' | 'created_at' | 'updated_at'>) => Promise<ClienteWeb | undefined>
  onUpdateClienteWeb?: (id: string, clienteWeb: Partial<ClienteWeb>) => Promise<ClienteWeb | undefined>
  onDeleteClienteWeb?: (id: string) => Promise<void>
}

// Configuración de estados con colores
const estadosConfig = {
  interesado: {
    label: "Interesado",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "💡",
  },
  contactado: {
    label: "Contactado",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: "📞",
  },
  en_negociacion: {
    label: "En Negociación",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: "💼",
  },
  cerrado: {
    label: "Cerrado",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: "✅",
  },
  perdido: {
    label: "Perdido",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: "❌",
  },
}

const ITEMS_PER_PAGE = 10

export function ClientesWebSection({ 
  clientesWeb = [],
  onCreateClienteWeb,
  onUpdateClienteWeb,
  onDeleteClienteWeb 
}: ClientesWebSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEstado, setSelectedEstado] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [editingClienteWeb, setEditingClienteWeb] = useState<ClienteWeb | null>(null)
  const [selectedClienteWeb, setSelectedClienteWeb] = useState<ClienteWeb | null>(null)
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    email: "",
    estado: "interesado" as ClienteWeb['estado'],
    productos_solicitados: ""
  })

  const resetForm = () => {
    setFormData({
      nombre_completo: "",
      telefono: "",
      email: "",
      estado: "interesado",
      productos_solicitados: ""
    })
    setEditingClienteWeb(null)
  }

  const handleEdit = (clienteWeb: ClienteWeb) => {
    setEditingClienteWeb(clienteWeb)
    setFormData({
      nombre_completo: clienteWeb.nombre_completo,
      telefono: clienteWeb.telefono || "",
      email: clienteWeb.email || "",
      estado: clienteWeb.estado,
      productos_solicitados: clienteWeb.productos_solicitados || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingClienteWeb) return

    const clienteWebData = {
      nombre_completo: formData.nombre_completo,
      telefono: formData.telefono || undefined,
      email: formData.email || undefined,
      estado: formData.estado,
      productos_solicitados: formData.productos_solicitados || undefined
    }

    try {
      await onUpdateClienteWeb?.(editingClienteWeb.id, clienteWebData)
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error updating cliente web:', error)
    }
  }

  const handleViewDetails = (clienteWeb: ClienteWeb) => {
    setSelectedClienteWeb(clienteWeb)
    setIsDetailsDialogOpen(true)
  }

  // Filtrado de clientes web
  const filteredClientesWeb = useMemo(() => {
    return clientesWeb.filter((clienteWeb) => {
      const matchesSearch = clienteWeb.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesEstado = selectedEstado === "all" || clienteWeb.estado === selectedEstado

      return matchesSearch && matchesEstado
    })
  }, [clientesWeb, searchTerm, selectedEstado])

  // Paginación
  const totalPages = Math.ceil(filteredClientesWeb.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedClientesWeb = filteredClientesWeb.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset página cuando cambian los filtros
  const handleFilterChange = () => {
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    handleFilterChange()
  }

  const handleEstadoChange = (value: string) => {
    setSelectedEstado(value)
    handleFilterChange()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalByEstado = (estado: keyof typeof estadosConfig) => {
    return clientesWeb.filter(c => c.estado === estado).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clientes Web</h1>
          <p className="text-muted-foreground">
            Gestiona los clientes que hacen consultas desde el sitio web
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientesWeb.length}</div>
            <p className="text-xs text-muted-foreground">
              clientes web registrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interesados</CardTitle>
            <div className="text-lg">💡</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {getTotalByEstado('interesado')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contactados</CardTitle>
            <div className="text-lg">📞</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {getTotalByEstado('contactado')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negociación</CardTitle>
            <div className="text-lg">💼</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {getTotalByEstado('en_negociacion')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cerrados</CardTitle>
            <div className="text-lg">✅</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {getTotalByEstado('cerrado')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            {/* Búsqueda por nombre */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre completo..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Filtro por estado */}
            <div className="w-full md:w-48">
              <Select value={selectedEstado} onValueChange={handleEstadoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  {Object.entries(estadosConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de clientes web */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes Web</CardTitle>
          <CardDescription>
            {filteredClientesWeb.length} cliente{filteredClientesWeb.length !== 1 ? 's' : ''} 
            {searchTerm || selectedEstado !== "all" ? ' filtrados' : ' en total'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead className="w-[200px]">Nombre Completo</TableHead>
                  <TableHead className="w-[120px]">Teléfono</TableHead>
                  <TableHead className="w-[120px]">Estado</TableHead>
                  <TableHead className="w-[130px]">Fecha</TableHead>
                  <TableHead className="text-right w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClientesWeb.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="h-8 w-8" />
                        <p>No se encontraron clientes web</p>
                        <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedClientesWeb.map((clienteWeb) => (
                    <TableRow key={clienteWeb.id}>
                      <TableCell>
                        <div className="font-mono text-sm font-medium">
                          #{clienteWeb.id.slice(-8).toUpperCase()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{clienteWeb.nombre_completo}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {clienteWeb.telefono ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{clienteWeb.telefono}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={`${estadosConfig[clienteWeb.estado].color} gap-1`}
                        >
                          <span>{estadosConfig[clienteWeb.estado].icon}</span>
                          {estadosConfig[clienteWeb.estado].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(clienteWeb.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(clienteWeb)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEdit(clienteWeb)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredClientesWeb.length)} de {filteredClientesWeb.length} clientes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else {
                      const start = Math.max(1, currentPage - 2)
                      const end = Math.min(totalPages, start + 4)
                      pageNum = start + i
                      if (pageNum > end) return null
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    )
                  }).filter(Boolean)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar cliente web */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente Web</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nombre_completo">Nombre Completo</Label>
              <Input
                id="nombre_completo"
                value={formData.nombre_completo}
                onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value) => setFormData({ ...formData, estado: value as ClienteWeb['estado'] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(estadosConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <span className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        {config.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="productos_solicitados">Productos Solicitados</Label>
              <textarea
                id="productos_solicitados"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Detalle de productos que solicita el cliente..."
                value={formData.productos_solicitados}
                onChange={(e) => setFormData({ ...formData, productos_solicitados: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  resetForm()
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar cambios
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog para ver detalles del cliente web */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cliente #{selectedClienteWeb?.id.slice(-8).toUpperCase()}
            </DialogTitle>
          </DialogHeader>
          
          {selectedClienteWeb && (
            <div className="space-y-4">
              {/* Información del cliente */}
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2 p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-xs text-muted-foreground">Nombre Completo</Label>
                  <p className="font-medium">{selectedClienteWeb.nombre_completo}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Estado</Label>
                  <div className="mt-1">
                    <Badge 
                      variant="outline" 
                      className={`${estadosConfig[selectedClienteWeb.estado].color} gap-1 text-xs`}
                    >
                      <span>{estadosConfig[selectedClienteWeb.estado].icon}</span>
                      {estadosConfig[selectedClienteWeb.estado].label}
                    </Badge>
                  </div>
                </div>
                {selectedClienteWeb.telefono && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Teléfono</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {selectedClienteWeb.telefono}
                    </p>
                  </div>
                )}
                {selectedClienteWeb.email && (
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedClienteWeb.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Productos solicitados */}
              <div>
                <Label className="font-semibold">Productos Solicitados</Label>
                {selectedClienteWeb.productos_solicitados ? (
                  <div className="mt-2 p-3 border rounded-lg bg-muted/20">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedClienteWeb.productos_solicitados}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">No hay productos solicitados registrados</p>
                  </div>
                )}
              </div>

              {/* Información adicional */}
              <div className="grid gap-2 grid-cols-2 text-xs text-muted-foreground border-t pt-3">
                <div>
                  <Label className="text-xs">Registrado</Label>
                  <p>{formatDate(selectedClienteWeb.created_at)}</p>
                </div>
                <div>
                  <Label className="text-xs">Actualizado</Label>
                  <p>{formatDate(selectedClienteWeb.updated_at)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}