"use client"

import { useState } from "react"
import {
  getClientById,
  getPurchasesByClient,
  getPaymentsByClient,
  getDriverById,
  getTruckById,
  mockTrucks,
  mockDrivers,
  mockClientPurchases,
  mockClientPayments,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Phone, ShoppingCart, CreditCard, Truck, User } from "lucide-react"
import Link from "next/link"
import type { ClientPurchase, Payment } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function ClientDetailContent({ clientId }: { clientId: string }) {
  const client = getClientById(clientId)
  const [purchases, setPurchases] = useState<ClientPurchase[]>(getPurchasesByClient(clientId))
  const [payments, setPayments] = useState<Payment[]>(getPaymentsByClient(clientId))

  const [activeTab, setActiveTab] = useState<"purchases" | "payments">("purchases")
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)

  // Purchase form state
  const [purchaseTruckId, setPurchaseTruckId] = useState("")
  const [purchaseDriverId, setPurchaseDriverId] = useState("")
  const [purchaseServiceType, setPurchaseServiceType] = useState<"transport" | "goods">("transport")
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0])
  const [purchaseGoodsType, setPurchaseGoodsType] = useState("")
  const [purchaseDescription, setPurchaseDescription] = useState("")

  // Payment form state
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0])

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">Client not found</p>
        <Link href="/clients">
          <Button variant="outline" className="h-12 bg-transparent">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Clients
          </Button>
        </Link>
      </div>
    )
  }

  const totalPurchases = purchases.reduce((sum, p) => sum + p.amount, 0)
  const totalPayments = payments.reduce((sum, p) => sum + p.amount, 0)
  const balance = totalPurchases - totalPayments

  const handleAddPurchase = () => {
    if (!purchaseTruckId || !purchaseDriverId || !purchaseAmount) return

    const newPurchase: ClientPurchase = {
      id: `purchase-${Date.now()}`,
      clientId,
      truckId: purchaseTruckId,
      driverId: purchaseDriverId,
      serviceType: purchaseServiceType,
      date: new Date(purchaseDate),
      amount: Number.parseFloat(purchaseAmount),
      goodsType: purchaseServiceType === "goods" ? purchaseGoodsType : undefined,
      description: purchaseServiceType === "goods" ? purchaseDescription : undefined,
      createdAt: new Date(),
    }

    setPurchases([newPurchase, ...purchases])
    mockClientPurchases.unshift(newPurchase)

    // Reset form
    setPurchaseTruckId("")
    setPurchaseDriverId("")
    setPurchaseServiceType("transport")
    setPurchaseAmount("")
    setPurchaseGoodsType("")
    setPurchaseDescription("")
    setPurchaseDialogOpen(false)
  }

  const handleAddPayment = () => {
    if (!paymentAmount) return

    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      clientId,
      date: new Date(paymentDate),
      amount: Number.parseFloat(paymentAmount),
      method: "cash",
      createdAt: new Date(),
    }

    setPayments([newPayment, ...payments])
    mockClientPayments.unshift(newPayment)

    // Reset form
    setPaymentAmount("")
    setPaymentDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <Link href="/clients">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">{client.name}</h1>
          {client.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone className="h-3 w-3" />
              {client.phone}
            </div>
          )}
        </div>
      </div>

      {/* Balance Card */}
      <div className="p-4 bg-card rounded-xl border border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-muted-foreground">Total Due</p>
            <p className="text-lg font-bold text-foreground">${totalPurchases.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Paid</p>
            <p className="text-lg font-bold text-green-500">${totalPayments.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className={`text-lg font-bold ${balance > 0 ? "text-amber-500" : "text-green-500"}`}>
              ${balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "purchases" ? "default" : "outline"}
          onClick={() => setActiveTab("purchases")}
          className="flex-1 h-12"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Purchases ({purchases.length})
        </Button>
        <Button
          variant={activeTab === "payments" ? "default" : "outline"}
          onClick={() => setActiveTab("payments")}
          className="flex-1 h-12"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Payments ({payments.length})
        </Button>
      </div>

      {/* Add Button */}
      <Button
        onClick={() => (activeTab === "purchases" ? setPurchaseDialogOpen(true) : setPaymentDialogOpen(true))}
        className="w-full h-12 bg-primary text-primary-foreground"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add {activeTab === "purchases" ? "Purchase" : "Payment"}
      </Button>

      {/* Content */}
      {activeTab === "purchases" ? (
        <div className="space-y-2">
          {purchases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No purchases yet</p>
          ) : (
            purchases.map((purchase) => {
              const truck = getTruckById(purchase.truckId)
              const driver = getDriverById(purchase.driverId)
              return (
                <div key={purchase.id} className="p-4 bg-card rounded-xl border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant={purchase.serviceType === "goods" ? "default" : "secondary"}>
                      {purchase.serviceType === "goods" ? "Buying Goods" : "Transport"}
                    </Badge>
                    <span className="font-bold text-foreground">${purchase.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {truck?.name || "Unknown"}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {driver?.name || "Unknown"}
                    </div>
                  </div>
                  {purchase.serviceType === "goods" && (
                    <div className="text-sm">
                      {purchase.goodsType && <p className="text-foreground font-medium">{purchase.goodsType}</p>}
                      {purchase.description && <p className="text-muted-foreground">{purchase.description}</p>}
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{purchase.date.toLocaleDateString()}</p>
                </div>
              )
            })
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No payments yet</p>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 bg-card rounded-xl border border-border flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-green-500">${payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{payment.date.toLocaleDateString()}</p>
                </div>
                <Badge variant="outline">Paid</Badge>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent className="mx-4 bg-card rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Purchase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base">Service Type</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={purchaseServiceType === "transport" ? "default" : "outline"}
                  onClick={() => setPurchaseServiceType("transport")}
                  className="h-12"
                >
                  Transport
                </Button>
                <Button
                  type="button"
                  variant={purchaseServiceType === "goods" ? "default" : "outline"}
                  onClick={() => setPurchaseServiceType("goods")}
                  className="h-12"
                >
                  Buying Goods
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Truck</Label>
              <Select value={purchaseTruckId} onValueChange={setPurchaseTruckId}>
                <SelectTrigger className="h-12 bg-secondary">
                  <SelectValue placeholder="Select truck" />
                </SelectTrigger>
                <SelectContent>
                  {mockTrucks.map((truck) => (
                    <SelectItem key={truck.id} value={truck.id}>
                      {truck.name} ({truck.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Driver</Label>
              <Select value={purchaseDriverId} onValueChange={setPurchaseDriverId}>
                <SelectTrigger className="h-12 bg-secondary">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  {mockDrivers.map((driver) => (
                    <SelectItem key={driver.id} value={driver.id}>
                      {driver.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base">Amount ($)</Label>
              <Input
                type="number"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="0.00"
                className="h-12 text-base bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-base">Date</Label>
              <Input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="h-12 text-base bg-secondary"
              />
            </div>

            {purchaseServiceType === "goods" && (
              <>
                <div className="space-y-2">
                  <Label className="text-base">Goods Type</Label>
                  <Input
                    value={purchaseGoodsType}
                    onChange={(e) => setPurchaseGoodsType(e.target.value)}
                    placeholder="e.g., Gravel, Sand, Cement"
                    className="h-12 text-base bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Description</Label>
                  <Textarea
                    value={purchaseDescription}
                    onChange={(e) => setPurchaseDescription(e.target.value)}
                    placeholder="Additional details..."
                    className="min-h-[80px] text-base bg-secondary"
                  />
                </div>
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPurchaseDialogOpen(false)} className="flex-1 h-12">
              Cancel
            </Button>
            <Button
              onClick={handleAddPurchase}
              className="flex-1 h-12 bg-primary text-primary-foreground"
              disabled={!purchaseTruckId || !purchaseDriverId || !purchaseAmount}
            >
              Add Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="mx-4 bg-card rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-base">Amount ($)</Label>
              <Input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="h-12 text-base bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-base">Date</Label>
              <Input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="h-12 text-base bg-secondary"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)} className="flex-1 h-12">
              Cancel
            </Button>
            <Button
              onClick={handleAddPayment}
              className="flex-1 h-12 bg-primary text-primary-foreground"
              disabled={!paymentAmount}
            >
              Add Payment
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
