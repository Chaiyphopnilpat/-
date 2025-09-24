import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import PaymentModal from "@/components/payment-modal";
import TransactionList from "@/components/transaction-list";
import AdminPanel from "@/components/admin-panel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Product, Transaction } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"products" | "transactions" | "admin">("products");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [promptpayId, setPromptpayId] = useState("0886363126");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCheckout = async () => {
    if (!selectedProduct || !promptpayId.trim()) {
      toast({
        title: "ข้อผิดพลาด",
        description: "กรุณาเลือกสินค้าและใส่หมายเลขพร้อมเพย์",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          promptpayId: promptpayId.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create transaction");
      }

      const data = await response.json();
      setCurrentTransaction(data.transaction);
      setShowPaymentModal(true);
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถสร้างรายการชำระเงินได้",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-thai">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AetherCompute</h1>
                <p className="text-xs text-gray-500">ระบบชำระเงินพร้อมเพย์</p>
              </div>
            </div>
            <nav className="flex items-center space-x-6">
              <Button
                variant={activeTab === "products" ? "default" : "ghost"}
                onClick={() => setActiveTab("products")}
                className="font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                สินค้า
              </Button>
              <Button
                variant={activeTab === "transactions" ? "default" : "ghost"}
                onClick={() => setActiveTab("transactions")}
                className="font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                </svg>
                ธุรกรรม
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/features"}
                className="font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                คลังฟีเจอร์
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = "/ai-tools"}
                className="font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Tools
              </Button>
              <Button
                variant={activeTab === "admin" ? "default" : "ghost"}
                onClick={() => setActiveTab("admin")}
                className="font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                จัดการ
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    เลือกสินค้าและบริการ
                  </h2>
                  
                  {productsLoading ? (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="border-2 border-gray-200 rounded-lg p-4 animate-pulse">
                          <div className="flex items-start space-x-4">
                            <div className="bg-gray-300 p-3 rounded-lg w-12 h-12"></div>
                            <div className="flex-1 space-y-2">
                              <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                              <div className="bg-gray-300 h-3 rounded w-full"></div>
                              <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isSelected={selectedProduct?.id === product.id}
                          onSelect={handleProductSelect}
                        />
                      ))}
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-6">
                    <Label htmlFor="promptpay-input" className="block text-sm font-semibold text-gray-700 mb-3">
                      <svg className="w-4 h-4 text-blue-600 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      หมายเลขพร้อมเพย์ (เบอร์โทรศัพท์ หรือ บัตรประชาชน)
                    </Label>
                    <Input
                      id="promptpay-input"
                      type="text"
                      placeholder="0812345678 หรือ 1234567890123"
                      value={promptpayId}
                      onChange={(e) => setPromptpayId(e.target.value)}
                      className="text-lg font-inter"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zM14 6a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h8z" />
                    </svg>
                    สรุปการสั่งซื้อ
                  </h3>

                  {selectedProduct ? (
                    <div className="mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className={`bg-gradient-to-br ${selectedProduct.color} p-2 rounded-lg text-white`}>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{selectedProduct.name}</h4>
                            <p className="text-lg font-bold text-blue-600">฿{selectedProduct.price.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 mb-6">
                      <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                      <p className="text-gray-500">กรุณาเลือกสินค้าที่ต้องการชำระเงิน</p>
                    </div>
                  )}

                  <Button
                    onClick={handleCheckout}
                    disabled={!selectedProduct || !promptpayId.trim()}
                    className="w-full"
                    size="lg"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zM13 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1V4zM13 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3z" clipRule="evenodd" />
                    </svg>
                    ชำระเงินด้วยพร้อมเพย์
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <TransactionList transactions={transactions} />
        )}

        {/* Admin Tab */}
        {activeTab === "admin" && (
          <AdminPanel />
        )}
      </main>

      {/* Payment Modal */}
      {showPaymentModal && currentTransaction && selectedProduct && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          transaction={currentTransaction}
          product={selectedProduct}
        />
      )}
    </div>
  );
}
