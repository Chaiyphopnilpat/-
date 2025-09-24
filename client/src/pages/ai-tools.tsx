import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AITool } from "@shared/schema";

interface AIToolsResponse {
  tools?: AITool[];
  message?: string;
}

export default function AIToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();

  const { data: aiTools = [], isLoading } = useQuery<AITool[]>({
    queryKey: ["/api/ai-tools", selectedCategory, searchTerm, currentPage],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);
      params.append("page", currentPage.toString());
      params.append("limit", "20");
      
      return fetch(`/api/ai-tools?${params}`)
        .then(res => res.json())
        .then(data => Array.isArray(data) ? data : []);
    },
  });

  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["/api/ai-tools/categories"],
    queryFn: () => fetch('/api/ai-tools/categories').then(res => res.json()),
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai-tools/import-excel");
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "สำเร็จ!",
        description: data.message || "นำเข้าข้อมูล AI Tools เรียบร้อยแล้ว",
      });
      setShowImportDialog(false);
      queryClient.invalidateQueries({ queryKey: ["/api/ai-tools"] });
    },
    onError: (error: any) => {
      toast({
        title: "ข้อผิดพลาด",
        description: error.message || "ไม่สามารถนำเข้าข้อมูลได้",
        variant: "destructive",
      });
    },
  });

  const handleImport = () => {
    importMutation.mutate();
  };

  const filteredTools = aiTools.filter(tool =>
    tool.toolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLicenseColor = (licenseType: string) => {
    switch (licenseType.toLowerCase()) {
      case "free": return "bg-green-100 text-green-800";
      case "single user": return "bg-blue-100 text-blue-800";
      case "multi user": return "bg-purple-100 text-purple-800";
      case "enterprise": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-thai">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Tools Directory</h1>
                <p className="text-xs text-gray-500">รวบรวมเครื่องมือ AI กว่า 5,000 รายการ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    นำเข้าข้อมูล
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>นำเข้าข้อมูล AI Tools</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      คลิกปุ่มด้านล่างเพื่อนำเข้าข้อมูลเครื่องมือ AI ทั้งหมด 5,000 รายการจากไฟล์ Excel
                    </p>
                    <Button 
                      onClick={handleImport} 
                      disabled={importMutation.isPending}
                      className="w-full"
                    >
                      {importMutation.isPending ? "กำลังนำเข้า..." : "เริ่มนำเข้าข้อมูล"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button 
                onClick={() => window.location.href = "/"}
                variant="ghost"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                กลับหน้าหลัก
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">ค้นหา</Label>
                <Input
                  placeholder="ค้นหาเครื่องมือ AI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">หมวดหมู่</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setCurrentPage(1);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  รีเซ็ต
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{aiTools.length}</p>
                  <p className="text-gray-600">เครื่องมือทั้งหมด</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-green-500 text-white p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zM6 5a1 1 0 011-1h4a1 1 0 011 1v6H6V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                  <p className="text-gray-600">หมวดหมู่</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="bg-purple-500 text-white p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredTools.length}</p>
                  <p className="text-gray-600">ผลการค้นหา</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tools Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="bg-gray-300 h-6 rounded w-3/4"></div>
                    <div className="bg-gray-300 h-4 rounded w-full"></div>
                    <div className="bg-gray-300 h-4 rounded w-5/6"></div>
                    <div className="flex space-x-2">
                      <div className="bg-gray-300 h-6 rounded w-16"></div>
                      <div className="bg-gray-300 h-6 rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่พบเครื่องมือที่ค้นหา</h3>
            <p className="text-gray-600 mb-4">ลองเปลี่ยนคำค้นหาหรือกดปุ่ม "นำเข้าข้อมูล" เพื่อโหลดข้อมูลเครื่องมือ AI</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                        {tool.toolName}
                      </h3>
                      {tool.isFeatured === 1 && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          แนะนำ
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {tool.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {tool.category}
                      </Badge>
                      <Badge className={getLicenseColor(tool.licenseType)} variant="secondary">
                        {tool.licenseType}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">ราคา</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            ${tool.priceUSD.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500">
                            (~฿{tool.priceTHB.toFixed(0)})
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(tool.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({tool.reviewCount})
                        </span>
                      </div>
                    </div>
                    
                    {tool.tags && tool.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tool.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {tool.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 pt-2">
                      {tool.url && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => window.open(tool.url, '_blank')}
                        >
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          เยี่ยมชม
                        </Button>
                      )}
                      
                      <Button size="sm" className="flex-1">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        เพิ่มในรายการ
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredTools.length > 0 && (
          <div className="flex justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ก่อนหน้า
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
              หน้า {currentPage}
            </span>
            <Button
              variant="outline"
              disabled={filteredTools.length < 20}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ถัดไป
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}