import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertProductSchema, type Product, type InsertProduct } from "@shared/schema";

export default function AdminPanel() {
  const [selectedIcon, setSelectedIcon] = useState("fas fa-server");
  const { toast } = useToast();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<InsertProduct>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      icon: "fas fa-server",
      color: "from-blue-500 to-blue-600",
      active: 1,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: InsertProduct) => {
      const response = await apiRequest("POST", "/api/products", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ!",
        description: "เพิ่มสินค้าใหม่เรียบร้อยแล้ว",
      });
      form.reset();
      setSelectedIcon("fas fa-server");
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มสินค้าได้",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ!",
        description: "ลบสินค้าเรียบร้อยแล้ว",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถลบสินค้าได้",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProduct) => {
    createProductMutation.mutate({
      ...data,
      icon: selectedIcon,
    });
  };

  const iconOptions = [
    { value: "fas fa-server", label: "Server", color: "from-blue-500 to-blue-600", icon: "🖥️" },
    { value: "fas fa-database", label: "Database", color: "from-green-500 to-green-600", icon: "💾" },
    { value: "fas fa-shield-alt", label: "Security", color: "from-purple-500 to-purple-600", icon: "🛡️" },
    { value: "fas fa-rocket", label: "Performance", color: "from-orange-500 to-orange-600", icon: "🚀" },
  ];

  const categoryOptions = [
    { value: "server", label: "Server & Hosting" },
    { value: "database", label: "Database" },
    { value: "security", label: "Security" },
    { value: "cdn", label: "CDN & Performance" },
  ];

  const getProductIcon = (iconClass: string) => {
    const option = iconOptions.find(opt => opt.value === iconClass);
    return option?.icon || "📦";
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Add Product Form */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              เพิ่มสินค้าใหม่
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อสินค้า</FormLabel>
                      <FormControl>
                        <Input placeholder="เช่น Cloud Server Pro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>รายละเอียด</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="อธิบายคุณสมบัติและข้อดีของสินค้า"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ราคา (บาท)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">฿</span>
                          <Input
                            type="number"
                            placeholder="1299"
                            className="pl-8"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หมวดหมู่</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="-- เลือกหมวดหมู่ --" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">ไอคอน</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {iconOptions.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={selectedIcon === option.value ? "default" : "outline"}
                        className="p-3 h-auto"
                        onClick={() => {
                          setSelectedIcon(option.value);
                          form.setValue("color", option.color);
                        }}
                      >
                        <span className="text-xl">{option.icon}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createProductMutation.isPending}
                >
                  {createProductMutation.isPending ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                      </svg>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                      </svg>
                      บันทึกสินค้า
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Product Management List */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  จัดการสินค้า
                </h2>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="pl-10 w-64"
                  />
                  <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <div className="bg-gray-300 p-3 rounded-lg w-12 h-12"></div>
                        <div className="flex-1 space-y-2">
                          <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                          <div className="bg-gray-300 h-3 rounded w-full"></div>
                          <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : products.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  <p className="text-gray-500">ยังไม่มีสินค้าในระบบ</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`bg-gradient-to-br ${product.color} p-3 rounded-lg text-white text-2xl`}>
                          {getProductIcon(product.icon)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.description}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-lg font-bold text-blue-600">฿{product.price.toLocaleString()}</span>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {categoryOptions.find(c => c.value === product.category)?.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              อัปเดต: {new Date(product.createdAt).toLocaleDateString('th-TH')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" title="แก้ไข">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={product.active ? "text-green-600" : "text-gray-400"}
                          title="เปิด/ปิด"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-4l-3 3-3-3H5a2 2 0 01-2-2V5z" clipRule="evenodd" />
                          </svg>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          title="ลบ"
                          onClick={() => deleteProductMutation.mutate(product.id)}
                          disabled={deleteProductMutation.isPending}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
