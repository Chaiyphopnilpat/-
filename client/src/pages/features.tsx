import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { FeatureCategory, Feature, FeatureRequest } from "@shared/schema";

export default function FeaturesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const { toast } = useToast();

  const { data: categories = [] } = useQuery<FeatureCategory[]>({
    queryKey: ["/api/feature-categories"],
  });

  const { data: features = [] } = useQuery<Feature[]>({
    queryKey: ["/api/features", selectedCategory, statusFilter, difficultyFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory !== "all") params.append("categoryId", selectedCategory);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (difficultyFilter !== "all") params.append("difficulty", difficultyFilter);
      
      return fetch(`/api/features?${params}`).then(res => res.json());
    },
  });

  const requestFeatureMutation = useMutation({
    mutationFn: async (data: { 
      featureId: string;
      clientName: string;
      clientEmail: string;
      customRequirements?: string;
      budget?: number;
      deadline?: string;
    }) => {
      const response = await apiRequest("POST", `/api/request-feature/${data.featureId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "สำเร็จ!",
        description: "ส่งคำขอพัฒนาฟีเจอร์เรียบร้อยแล้ว เราจะติดต่อกลับภายใน 24 ชั่วโมง",
      });
      setShowRequestModal(false);
      queryClient.invalidateQueries({ queryKey: ["/api/feature-requests"] });
    },
    onError: () => {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถส่งคำขอได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    },
  });

  const filteredFeatures = features.filter(feature =>
    feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feature.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "expert": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "planned": return "bg-purple-100 text-purple-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  const handleRequestFeature = (feature: Feature) => {
    setSelectedFeature(feature);
    setShowRequestModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-thai">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">คลังฟีเจอร์ขั้นสูง</h1>
                <p className="text-xs text-gray-500">รายการฟีเจอร์ 1000+ ฟังก์ชันพร้อมโค้ดตัวอย่าง</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                {filteredFeatures.length} ฟีเจอร์
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">ค้นหา</Label>
                <Input
                  placeholder="ค้นหาฟีเจอร์..."
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
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">สถานะ</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกสถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="planned">วางแผน</SelectItem>
                    <SelectItem value="in_progress">กำลังพัฒนา</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                    <SelectItem value="archived">เก็บถาวร</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-semibold text-gray-700 mb-2 block">ระดับความยาก</Label>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="เลือกระดับ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="beginner">เริ่มต้น</SelectItem>
                    <SelectItem value="intermediate">ปานกลาง</SelectItem>
                    <SelectItem value="advanced">ขั้นสูง</SelectItem>
                    <SelectItem value="expert">ผู้เชี่ยวชาญ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSelectedCategory("all");
                    setStatusFilter("all");
                    setDifficultyFilter("all");
                    setSearchTerm("");
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

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => {
            const category = getCategoryInfo(feature.categoryId);
            return (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`bg-gradient-to-br ${category?.color || 'from-gray-500 to-gray-600'} p-3 rounded-lg text-white`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getDifficultyColor(feature.difficulty)}>
                        {feature.difficulty}
                      </Badge>
                      <Badge className={getStatusColor(feature.status)}>
                        {feature.status}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 mb-2">{feature.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{feature.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">เวลาประมาณ:</span>
                      <span className="font-semibold">{feature.estimatedHours} ชั่วโมง</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ราคา:</span>
                      <span className="font-bold text-purple-600">฿{feature.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">ลำดับความสำคัญ:</span>
                      <Badge className={getPriorityColor(feature.priority)}>
                        {feature.priority}
                      </Badge>
                    </div>
                  </div>

                  {feature.technologies && feature.technologies.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">เทคโนโลยี:</p>
                      <div className="flex flex-wrap gap-1">
                        {feature.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {feature.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{feature.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          ดูรายละเอียด
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">{feature.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">รายละเอียด</h4>
                            <p className="text-gray-600">{feature.description}</p>
                          </div>
                          
                          {feature.codeExample && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">ตัวอย่างโค้ด</h4>
                              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                                <code>{feature.codeExample}</code>
                              </pre>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">ข้อมูลทั่วไป</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>ระดับความยาก:</span>
                                  <Badge className={getDifficultyColor(feature.difficulty)}>
                                    {feature.difficulty}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>เวลาประมาณ:</span>
                                  <span>{feature.estimatedHours} ชั่วโมง</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>ราคา:</span>
                                  <span className="font-bold">฿{feature.price.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">สถานะ</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>สถานะปัจจุบัน:</span>
                                  <Badge className={getStatusColor(feature.status)}>
                                    {feature.status}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span>ลำดับความสำคัญ:</span>
                                  <Badge className={getPriorityColor(feature.priority)}>
                                    {feature.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          {feature.technologies && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">เทคโนโลยีที่ใช้</h4>
                              <div className="flex flex-wrap gap-2">
                                {feature.technologies.map((tech, index) => (
                                  <Badge key={index} variant="outline">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {feature.tags && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">แท็ก</h4>
                              <div className="flex flex-wrap gap-2">
                                {feature.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleRequestFeature(feature)}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      ขอใบเสนอราคา
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">ไม่พบฟีเจอร์ที่ค้นหา</h3>
            <p className="text-gray-600">ลองเปลี่ยนคำค้นหาหรือปรับฟิลเตอร์</p>
          </div>
        )}

        {/* Request Feature Modal */}
        <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>ขอใบเสนอราคา</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                if (selectedFeature) {
                  requestFeatureMutation.mutate({
                    featureId: selectedFeature.id,
                    clientName: formData.get("clientName") as string,
                    clientEmail: formData.get("clientEmail") as string,
                    customRequirements: formData.get("customRequirements") as string || undefined,
                    budget: formData.get("budget") ? Number(formData.get("budget")) : undefined,
                    deadline: formData.get("deadline") as string || undefined,
                  });
                }
              }}
              className="space-y-4"
            >
              {selectedFeature && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold">{selectedFeature.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">ราคาเริ่มต้น: ฿{selectedFeature.price.toLocaleString()}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="clientName">ชื่อ-นามสกุล *</Label>
                <Input name="clientName" required />
              </div>
              
              <div>
                <Label htmlFor="clientEmail">อีเมล *</Label>
                <Input name="clientEmail" type="email" required />
              </div>
              
              <div>
                <Label htmlFor="customRequirements">ความต้องการเพิ่มเติม</Label>
                <Textarea 
                  name="customRequirements" 
                  placeholder="บอกเราเกี่ยวกับความต้องการพิเศษหรือการปรับแต่ง..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="budget">งบประมาณ (บาท)</Label>
                <Input 
                  name="budget" 
                  type="number" 
                  placeholder={selectedFeature?.price.toString()}
                />
              </div>
              
              <div>
                <Label htmlFor="deadline">กำหนดเวลา</Label>
                <Input name="deadline" type="date" />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1"
                >
                  ยกเลิก
                </Button>
                <Button 
                  type="submit" 
                  disabled={requestFeatureMutation.isPending}
                  className="flex-1"
                >
                  {requestFeatureMutation.isPending ? "กำลังส่ง..." : "ส่งคำขอ"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}