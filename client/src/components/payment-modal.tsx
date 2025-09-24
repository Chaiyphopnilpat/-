import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, Product } from "@shared/schema";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  product: Product;
}

export default function PaymentModal({ isOpen, onClose, transaction, product }: PaymentModalProps) {
  const [currentStatus, setCurrentStatus] = useState(transaction.status);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen || currentStatus !== "pending") return;

    // Poll for transaction status updates
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/transactions/${transaction.id}`);
        if (response.ok) {
          const updatedTransaction = await response.json();
          setCurrentStatus(updatedTransaction.status);
          
          if (updatedTransaction.status === "completed") {
            toast({
              title: "ชำระเงินสำเร็จ!",
              description: "บริการของคุณพร้อมใช้งานแล้ว",
            });
          } else if (updatedTransaction.status === "failed") {
            toast({
              title: "การชำระเงินล้มเหลว",
              description: "กรุณาลองใหม่อีกครั้ง",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Failed to check transaction status:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, transaction.id, currentStatus, toast]);

  // Simulate payment completion for demo (remove in production)
  useEffect(() => {
    if (currentStatus === "pending") {
      const timeout = setTimeout(() => {
        setCurrentStatus("completed");
      }, 15000); // Auto-complete after 15 seconds for demo

      return () => clearTimeout(timeout);
    }
  }, [currentStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">ชำระเงินด้วยพร้อมเพย์</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Status */}
          <div className="text-center">
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${getStatusColor(currentStatus)}`}>
              {currentStatus === "pending" && (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                  </svg>
                  รอการชำระเงิน
                </>
              )}
              {currentStatus === "completed" && (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  ชำระเงินสำเร็จ!
                </>
              )}
              {currentStatus === "failed" && (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  การชำระเงินล้มเหลว
                </>
              )}
            </div>
          </div>

          {/* QR Code - Show only when pending */}
          {currentStatus === "pending" && (
            <>
              <div className="qr-container text-center">
                <img 
                  src={transaction.qrCode} 
                  alt="PromptPay QR Code" 
                  className="mx-auto w-64 h-64 border-4 border-gray-200 rounded-lg"
                />
                <p className="text-sm text-gray-600 mt-4">สแกน QR Code ด้วยแอปธนาคารของคุณ</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">วิธีการชำระเงิน</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. เปิดแอปธนาคารของคุณ</li>
                  <li>2. เลือกเมนู "สแกน QR Code"</li>
                  <li>3. กดยืนยันการโอนเงิน</li>
                  <li>4. รอระบบตรวจสอบการชำระเงิน</li>
                </ol>
              </div>
            </>
          )}

          {/* Success Message */}
          {currentStatus === "completed" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <h4 className="font-semibold text-green-900 mb-2">ขั้นตอนถัดไป</h4>
              <p className="text-sm text-green-800">ตรวจสอบอีเมลของคุณเพื่อดูรายละเอียดการใช้งานบริการ</p>
            </div>
          )}

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">ผู้รับเงิน</span>
              <span className="font-semibold">AetherCompute Co., Ltd.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">สินค้า</span>
              <span className="font-semibold">{product.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">จำนวนเงิน</span>
              <span className="font-bold text-xl text-blue-600">฿{transaction.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">รหัสธุรกรรม</span>
              <span className="font-mono text-sm">#{transaction.id.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          {/* Action Button */}
          {currentStatus === "completed" && (
            <Button className="w-full" onClick={onClose}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              ไปยังแดชบอร์ด
            </Button>
          )}

          {currentStatus === "failed" && (
            <Button className="w-full" onClick={onClose}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
              </svg>
              ลองใหม่อีกครั้ง
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
