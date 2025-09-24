import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Play, 
  Code, 
  Clock, 
  DollarSign, 
  Star, 
  TrendingUp,
  Zap,
  Brain,
  Settings,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import type { FeatureCategory, Feature } from '@shared/schema';

export default function AIFunctionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedFunction, setSelectedFunction] = useState<Feature | null>(null);
  const [isExecuteDialogOpen, setIsExecuteDialogOpen] = useState(false);
  const [executionParams, setExecutionParams] = useState<Record<string, string>>({});

  // Fetch categories and features
  const { data: categories = [] } = useQuery<FeatureCategory[]>({
    queryKey: ['/api/feature-categories'],
  });

  const { data: features = [] } = useQuery<Feature[]>({
    queryKey: ['/api/features'],
  });

  // Execute function mutation
  const executeFunction = useMutation({
    mutationFn: async (data: { functionId: string; params: Record<string, string> }) => {
      return apiRequest(`/api/functions/execute/${data.functionId}`, {
        method: 'POST',
        body: JSON.stringify(data.params),
      });
    },
    onSuccess: () => {
      setIsExecuteDialogOpen(false);
      setExecutionParams({});
    }
  });

  // Filter functions based on search and filters
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || feature.categoryId === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || feature.difficulty === selectedDifficulty;
    const matchesStatus = !selectedStatus || feature.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'planned': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'medium': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'low': return <TrendingUp className="h-4 w-4 text-green-500" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              AI Functions SaaS
            </h1>
            <p className="text-muted-foreground mt-2">
              ระบบจัดการฟังก์ชัน AI และ API มากกว่า 1,000 ฟังก์ชัน
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {features.length} ฟังก์ชัน
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {categories.length} หมวดหมู่
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ค้นหาฟังก์ชัน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="หมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั้งหมด</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="ความยาก" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั้งหมด</SelectItem>
                  <SelectItem value="basic">เบื้องต้น</SelectItem>
                  <SelectItem value="intermediate">ปานกลาง</SelectItem>
                  <SelectItem value="advanced">ขั้นสูง</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">ทั้งหมด</SelectItem>
                  <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                  <SelectItem value="in_progress">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="planned">วางแผน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Function Catalog */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature) => {
            const category = categories.find(c => c.id === feature.categoryId);
            
            return (
              <Card key={feature.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {feature.name}
                      </CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {category?.name}
                      </CardDescription>
                    </div>
                    {getPriorityIcon(feature.priority)}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge 
                      variant="secondary" 
                      className={`${getDifficultyColor(feature.difficulty)} text-white text-xs`}
                    >
                      {feature.difficulty}
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className={`${getStatusColor(feature.status)} text-white text-xs`}
                    >
                      {feature.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {feature.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{feature.estimatedHours} ชม.</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{feature.price?.toLocaleString()} ฿</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            {feature.name}
                          </DialogTitle>
                          <DialogDescription>
                            {feature.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <ScrollArea className="max-h-[60vh]">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>หมวดหมู่</Label>
                                <p className="text-sm">{category?.name}</p>
                              </div>
                              <div className="space-y-2">
                                <Label>ความยาก</Label>
                                <Badge className={`${getDifficultyColor(feature.difficulty)} text-white`}>
                                  {feature.difficulty}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <Label>เวลาประมาณ</Label>
                                <p className="text-sm">{feature.estimatedHours} ชั่วโมง</p>
                              </div>
                              <div className="space-y-2">
                                <Label>ราคา</Label>
                                <p className="text-sm">{feature.price?.toLocaleString()} บาท</p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-2">
                              <Label>เทคโนโลยี</Label>
                              <div className="flex flex-wrap gap-2">
                                {feature.technologies?.map((tech, index) => (
                                  <Badge key={index} variant="outline">
                                    {tech}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>แท็ก</Label>
                              <div className="flex flex-wrap gap-2">
                                {feature.tags?.map((tag, index) => (
                                  <Badge key={index} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            {feature.codeExample && (
                              <div className="space-y-2">
                                <Label>ตัวอย่างโค้ด</Label>
                                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                                  <code>{feature.codeExample}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </DialogContent>
                    </Dialog>

                    {feature.status === 'completed' && (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedFunction(feature);
                          setIsExecuteDialogOpen(true);
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Play className="h-4 w-4 mr-1" />
                        เรียกใช้
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredFeatures.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ไม่พบฟังก์ชันที่ตรงกับเงื่อนไข</p>
            </CardContent>
          </Card>
        )}

        {/* Execute Function Dialog */}
        <Dialog open={isExecuteDialogOpen} onOpenChange={setIsExecuteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                เรียกใช้ฟังก์ชัน: {selectedFunction?.name}
              </DialogTitle>
              <DialogDescription>
                กรอกพารามิเตอร์ที่จำเป็นสำหรับการเรียกใช้ฟังก์ชัน
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>พารามิเตอร์ (JSON)</Label>
                <Textarea
                  placeholder='{"param1": "value1", "param2": "value2"}'
                  value={JSON.stringify(executionParams, null, 2)}
                  onChange={(e) => {
                    try {
                      const params = JSON.parse(e.target.value);
                      setExecutionParams(params);
                    } catch {
                      // Invalid JSON, keep current state
                    }
                  }}
                  rows={6}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => {
                    if (selectedFunction) {
                      executeFunction.mutate({
                        functionId: selectedFunction.id,
                        params: executionParams
                      });
                    }
                  }}
                  disabled={executeFunction.isPending}
                  className="flex-1"
                >
                  {executeFunction.isPending ? (
                    <>กำลังประมวลผล...</>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      เรียกใช้ฟังก์ชัน
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsExecuteDialogOpen(false)}
                >
                  ยกเลิก
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}