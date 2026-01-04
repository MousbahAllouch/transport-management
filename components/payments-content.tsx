"use client"

import { useState } from "react"
import { DataTable } from "./data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, CreditCard, Banknote, Building } from "lucide-react"
import { mockPayments, mockClients, getClientById } from "@/lib/mock-data"
import type { Payment } from "@/lib/types"
import { PaymentFormDialog } from "./payment-form-dialog"
import { StatsCard } from "./stats-card"
import { DollarSign, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const methodIcons: Record<string, typeof CreditCard> = {
  cash: Banknote,
  transfer: Building,
  check: CreditCard,
}

export function PaymentsContent() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>()
  const [filterClient, setFilterClient] = useState<string>("all")
  const [filterMethod, setFilterMethod] = useState<string>("all")

  const filteredPayments = payments.filter((payment) => {
    if (filterClient !== "all" && payment.clientId !== filterClient) return false
    if (filterMethod !== "all" && payment.method !== filterMethod) return false
    return true
  })

  const totalReceived = filteredPayments.reduce((acc, p) => acc + p.amount, 0)
  const totalOutstanding = mockClients.reduce((acc, c) => acc + (c.totalBilled - c.totalPaid), 0)

  const columns = [
    {
      key: "date",
      header: "Date",
      cell: (payment: Payment) => {
        const Icon = methodIcons[payment.method] || CreditCard
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Icon className="h-5 w-5 text-success" />
            </div>
            <span>{payment.date.toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      key: "client",
      header: "Client",
      cell: (payment: Payment) => {
        const client = getClientById(payment.clientId)
        return <span className="font-medium">{client?.name}</span>
      },
    },
    {
      key: "amount",
      header: "Amount",
      cell: (payment: Payment) => <span className="font-medium text-success">${payment.amount.toLocaleString()}</span>,
    },
    {
      key: "method",
      header: "Method",
      cell: (payment: Payment) => (
        <Badge variant="outline" className="capitalize">
          {payment.method}
        </Badge>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      cell: (payment: Payment) => payment.reference || <span className="text-muted-foreground">-</span>,
    },
    {
      key: "notes",
      header: "Notes",
      cell: (payment: Payment) => (
        <span className="text-sm text-muted-foreground max-w-[150px] truncate">{payment.notes || "-"}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      cell: (payment: Payment) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setEditingPayment(payment)
            setDialogOpen(true)
          }}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const handleAddPayment = (data: Omit<Payment, "id" | "createdAt">) => {
    if (editingPayment) {
      setPayments(payments.map((p) => (p.id === editingPayment.id ? { ...p, ...data } : p)))
    } else {
      const payment: Payment = {
        ...data,
        id: `payment-${Date.now()}`,
        createdAt: new Date(),
      }
      setPayments([payment, ...payments])
    }
    setDialogOpen(false)
    setEditingPayment(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">Track client payments</p>
        </div>
        <Button
          onClick={() => {
            setEditingPayment(undefined)
            setDialogOpen(true)
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Received"
          value={`$${totalReceived.toLocaleString()}`}
          icon={DollarSign}
          className="border-l-2 border-l-success"
        />
        <StatsCard
          title="Outstanding Balance"
          value={`$${totalOutstanding.toLocaleString()}`}
          icon={AlertTriangle}
          className="border-l-2 border-l-warning"
        />
        <StatsCard title="Total Transactions" value={filteredPayments.length} icon={CreditCard} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filterClient} onValueChange={setFilterClient}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Filter by client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {mockClients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterMethod} onValueChange={setFilterMethod}>
          <SelectTrigger className="w-[180px] bg-secondary">
            <SelectValue placeholder="Payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="transfer">Transfer</SelectItem>
            <SelectItem value="check">Check</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable data={filteredPayments} columns={columns} />

      <PaymentFormDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingPayment(undefined)
        }}
        onSubmit={handleAddPayment}
        initialData={editingPayment}
        clients={mockClients}
      />
    </div>
  )
}
