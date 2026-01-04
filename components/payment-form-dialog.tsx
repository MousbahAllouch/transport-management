"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Payment, Client } from "@/lib/types"

interface PaymentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payment: Omit<Payment, "id" | "createdAt">) => void
  initialData?: Payment
  clients: Client[]
}

export function PaymentFormDialog({ open, onOpenChange, onSubmit, initialData, clients }: PaymentFormDialogProps) {
  const [formData, setFormData] = useState({
    clientId: "",
    date: new Date(),
    amount: 0,
    method: "transfer" as "cash" | "transfer" | "check",
    reference: "",
    notes: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        clientId: initialData.clientId,
        date: initialData.date,
        amount: initialData.amount,
        method: initialData.method,
        reference: initialData.reference || "",
        notes: initialData.notes || "",
      })
    } else {
      setFormData({
        clientId: "",
        date: new Date(),
        amount: 0,
        method: "transfer",
        reference: "",
        notes: "",
      })
    }
  }, [initialData, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const selectedClient = clients.find((c) => c.id === formData.clientId)
  const outstandingBalance = selectedClient ? selectedClient.totalBilled - selectedClient.totalPaid : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Payment" : "Record Payment"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update payment details" : "Record a new payment from a client"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClient && outstandingBalance > 0 && (
                <p className="text-xs text-warning">Outstanding: ${outstandingBalance.toLocaleString()}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date.toISOString().split("T")[0]}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  className="bg-secondary"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="bg-secondary"
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="method">Payment Method</Label>
              <Select
                value={formData.method}
                onValueChange={(value: "cash" | "transfer" | "check") => setFormData({ ...formData, method: value })}
              >
                <SelectTrigger className="bg-secondary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference">Reference Number (Optional)</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="bg-secondary"
                placeholder="TRF-2025-XXX or CHK-XXXX"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-secondary"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              {initialData ? "Save Changes" : "Record Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
