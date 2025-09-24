import uuid
from datetime import datetime
from typing import Dict, List

class PaymentSystem:
    def __init__(self):
        # ฐานข้อมูลบัญชีจำลอง
        self.accounts: Dict[str, float] = {}
        # บันทึกการทำธุรกรรม
        self.transactions: List[Dict] = []

    def create_account(self, initial_balance: float = 0) -> str:
        """
        สร้างบัญชีใหม่
        :return: รหัสบัญชี
        """
        account_id = str(uuid.uuid4())
        self.accounts[account_id] = initial_balance
        return account_id

    def check_balance(self, account_id: str) -> float:
        """
        ตรวจสอบยอดเงินคงเหลือ
        """
        return self.accounts.get(account_id, 0)

    def transfer(self, 
                 from_account: str, 
                 to_account: str, 
                 amount: float) -> bool:
        """
        โอนเงินระหว่างบัญชี
        """
        # ตรวจสอบความถูกต้องของบัญชี
        if from_account not in self.accounts or to_account not in self.accounts:
            print("❌ บัญชีไม่ถูกต้อง")
            return False

        # ตรวจสอบยอดเงิน
        if self.accounts[from_account] < amount:
            print("❌ เงินในบัญชีไม่เพียงพอ")
            return False

        # ดำเนินการโอนเงิน
        self.accounts[from_account] -= amount
        self.accounts[to_account] += amount

        # บันทึกธุรกรรม
        transaction = {
            'id': str(uuid.uuid4()),
            'from': from_account,
            'to': to_account,
            'amount': amount,
            'timestamp': datetime.now()
        }
        self.transactions.append(transaction)

        print(f"✅ โอนเงิน {amount} บาท สำเร็จ")
        return True

    def deposit(self, account_id: str, amount: float) -> bool:
        """
        ฝากเงินเข้าบัญชี
        """
        if account_id not in self.accounts:
            print("❌ บัญชีไม่ถูกต้อง")
            return False

        self.accounts[account_id] += amount
        
        # บันทึกธุรกรรม
        transaction = {
            'id': str(uuid.uuid4()),
            'type': 'deposit',
            'account': account_id,
            'amount': amount,
            'timestamp': datetime.now()
        }
        self.transactions.append(transaction)

        print(f"✅ ฝากเงิน {amount} บาท สำเร็จ")
        return True

    def withdraw(self, account_id: str, amount: float) -> bool:
        """
        ถอนเงินจากบัญชี
        """
        if account_id not in self.accounts:
            print("❌ บัญชีไม่ถูกต้อง")
            return False

        if self.accounts[account_id] < amount:
            print("❌ เงินในบัญชีไม่เพียงพอ")
            return False

        self.accounts[account_id] -= amount
        
        # บันทึกธุรกรรม
        transaction = {
            'id': str(uuid.uuid4()),
            'type': 'withdraw',
            'account': account_id,
            'amount': amount,
            'timestamp': datetime.now()
        }
        self.transactions.append(transaction)

        print(f"✅ ถอนเงิน {amount} บาท สำเร็จ")
        return True

    def get_transaction_history(self, account_id: str) -> List[Dict]:
        """
        ดึงประวัติการทำธุรกรรม
        """
        return [
            tx for tx in self.transactions 
            if tx.get('from') == account_id or tx.get('to') == account_id or tx.get('account') == account_id
        ]

    def pay_bill(self, account_id: str, bill_amount: float, bill_type: str) -> bool:
        """
        ชำระค่าบริการ
        """
        if account_id not in self.accounts:
            print("❌ บัญชีไม่ถูกต้อง")
            return False

        if self.accounts[account_id] < bill_amount:
            print("❌ เงินในบัญชีไม่เพียงพอ")
            return False

        self.accounts[account_id] -= bill_amount
        
        # บันทึกธุรกรรม
        transaction = {
            'id': str(uuid.uuid4()),
            'type': 'bill_payment',
            'account': account_id,
            'amount': bill_amount,
            'bill_type': bill_type,
            'timestamp': datetime.now()
        }
        self.transactions.append(transaction)

        print(f"✅ ชำระ{bill_type} {bill_amount} บาท สำเร็จ")
        return True

# ตัวอย่างการใช้งาน
def main():
    # สร้างระบบชำระเงิน
    payment = PaymentSystem()

    # สร้างบัญชี
    account1 = payment.create_account(initial_balance=1000)
    account2 = payment.create_account(initial_balance=500)

    print("=== ระบบชำระเงิน ===")
    print(f"สร้างบัญชี 1: {account1[:8]}...")
    print(f"สร้างบัญชี 2: {account2[:8]}...")
    print()

    # ฝากเงิน
    payment.deposit(account1, 500)
    print(f"ยอดเงินบัญชี 1: {payment.check_balance(account1)} บาท")
    print()

    # โอนเงิน
    payment.transfer(account1, account2, 300)
    print(f"ยอดเงินบัญชี 1: {payment.check_balance(account1)} บาท")
    print(f"ยอดเงินบัญชี 2: {payment.check_balance(account2)} บาท")
    print()

    # ชำระค่าบริการ
    payment.pay_bill(account1, 200, "ค่าไฟฟ้า")
    print(f"ยอดเงินบัญชี 1: {payment.check_balance(account1)} บาท")
    print()

    # ดูประวัติการทำธุรกรรม
    print("=== ประวัติการทำธุรกรรม ===")
    for tx in payment.get_transaction_history(account1):
        print(f"ID: {tx['id'][:8]}...")
        print(f"ประเภท: {tx.get('type', 'transfer')}")
        print(f"จำนวน: {tx['amount']} บาท")
        print(f"เวลา: {tx['timestamp'].strftime('%Y-%m-%d %H:%M:%S')}")
        print("-" * 30)

if __name__ == "__main__":
    main()