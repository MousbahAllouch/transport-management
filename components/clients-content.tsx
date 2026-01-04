"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Search } from "lucide-react"
import { mockClients } from "@/lib/mock-data"
import type { Client } from "@/lib/types"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export function ClientsContent() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(search.toLowerCase()))

  const handleAddClient = () => {
    if (!newName.trim()) return

    const client: Client = {
      id: `client-${Date.now()}`,
      name: newName,
      phone: newPhone,
      createdAt: new Date(),
    }
    setClients([...clients, client])
    setNewName("")
    setNewPhone("")
    setDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Clients</h1>
        <Button onClick={() => setDialogOpen(true)} size="lg" className="h-12 px-6 bg-primary text-primary-foreground">
          <Plus className="h-5 w-5 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pl-10 text-base bg-card border-border"
        />
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="flex items-center justify-between p-4 bg-card rounded-xl border border-border active:bg-accent transition-colors"
          >
            <div>
              <p className="text-lg font-medium text-foreground">{client.name}</p>
              {client.phone && <p className="text-sm text-muted-foreground">{client.phone}</p>}
            </div>
            <div className="text-muted-foreground">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
        {filteredClients.length === 0 && <p className="text-muted-foreground text-center py-8">No clients found</p>}
      </div>

      {/* Add Client Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="mx-4 bg-card rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                Client Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter client name"
                className="h-12 text-base bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-base">
                Phone (optional)
              </Label>
              <Input
                id="phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="Enter phone number"
                className="h-12 text-base bg-secondary"
                type="tel"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1 h-12">
              Cancel
            </Button>
            <Button
              onClick={handleAddClient}
              className="flex-1 h-12 bg-primary text-primary-foreground"
              disabled={!newName.trim()}
            >
              Add Client
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
