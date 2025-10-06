'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Search, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Matches the updated backend.json entity
export type GymClass = {
  id: string;
  className: string;
  trainerName: string;
  dateTime: string; // Storing as ISO string
  duration: number; // in minutes
  maxMembers: number;
  enrolledMembers: number;
  createdAt: Timestamp;
};

export default function SchedulePage() {
  const { firestore, user: currentUser } = useFirebase();
  const { toast } = useToast();

  const schedulesCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'schedules') : null),
    [firestore]
  );
  const { data: classes, isLoading } = useCollection<GymClass>(schedulesCollection);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<GymClass | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const initialNewClassState = {
    className: '',
    trainerName: '',
    dateTime: '',
    duration: 60,
    maxMembers: 10,
  };
  const [newClass, setNewClass] = useState(initialNewClassState);

  const filteredAndSortedClasses = useMemo(() => {
    if (!classes) return [];
    
    let filtered = classes.filter(c =>
        c.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.className.localeCompare(b.className);
        }
        return b.className.localeCompare(a.className);
    });

    return sorted;
  }, [classes, searchQuery, sortOrder]);

  const isAdmin = currentUser?.email === 'admin@gmail.com';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    const processedValue = type === 'number' ? parseInt(value, 10) || 0 : value;
    
    if (editDialogOpen && selectedClass) {
      setSelectedClass({ ...selectedClass, [id]: processedValue });
    } else {
      setNewClass((prev) => ({ ...prev, [id]: processedValue }));
    }
  };

  const handleAddClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    try {
      const schedulesCollectionRef = collection(firestore, 'schedules');
      await addDoc(schedulesCollectionRef, {
        ...newClass,
        dateTime: new Date(newClass.dateTime).toISOString(),
        enrolledMembers: 0,
        createdAt: serverTimestamp(),
      });
      toast({
        title: 'Class Added',
        description: `${newClass.className} has been successfully added.`,
      });
      setAddDialogOpen(false);
      setNewClass(initialNewClassState);
    } catch (error: any) {
      console.error('Error adding class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to add class: ${error.message}`,
      });
    }
  };

  const handleEditClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore || !selectedClass) return;

    try {
      const classDocRef = doc(firestore, 'schedules', selectedClass.id);
      await updateDoc(classDocRef, {
        className: selectedClass.className,
        trainerName: selectedClass.trainerName,
        dateTime: new Date(selectedClass.dateTime).toISOString(),
        duration: selectedClass.duration,
        maxMembers: selectedClass.maxMembers,
        enrolledMembers: selectedClass.enrolledMembers,
      });
      toast({
        title: 'Class Updated',
        description: `Details for ${selectedClass.className} have been updated.`,
      });
      setEditDialogOpen(false);
      setSelectedClass(null);
    } catch (error: any) {
      console.error('Error updating class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update class: ${error.message}`,
      });
    }
  };

  const handleDeleteClass = async (classId: string) => {
    if (!firestore) return;
    try {
      const classDocRef = doc(firestore, 'schedules', classId);
      await deleteDoc(classDocRef);
      toast({
        title: 'Class Deleted',
        description: 'The class has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete class: ${error.message}`,
      });
    }
  };

  const openEditDialog = (gymClass: GymClass) => {
    setSelectedClass({
      ...gymClass,
      dateTime: new Date(gymClass.dateTime).toISOString().slice(0, 16)
    });
    setEditDialogOpen(true);
  };
  
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
            <CardTitle>Class Schedule</CardTitle>
            <CardDescription>
                Manage your classes, trainers, and enrollment.
            </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by class or trainer..."
                        className="pl-8 sm:w-[200px] md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                 <div className="flex gap-2">
                  <Button variant="outline" onClick={toggleSortOrder}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort by Class
                  </Button>
                </div>
                {isAdmin && (
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                    <Button>Add Class</Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Class</DialogTitle>
                        <DialogDescription>
                        Enter the details for the new class.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddClass} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="className" className="text-right">Class Name</Label>
                        <Input id="className" value={newClass.className} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="trainerName" className="text-right">Trainer</Label>
                        <Input id="trainerName" value={newClass.trainerName} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dateTime" className="text-right">Date & Time</Label>
                        <Input id="dateTime" type="datetime-local" value={newClass.dateTime} onChange={handleInputChange} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">Duration (min)</Label>
                        <Input id="duration" type="number" value={newClass.duration} onChange={handleInputChange} className="col-span-3" required min="1" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxMembers" className="text-right">Max Members</Label>
                        <Input id="maxMembers" type="number" value={newClass.maxMembers} onChange={handleInputChange} className="col-span-3" required min="1" />
                        </div>
                        <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Add Class</Button>
                        </DialogFooter>
                    </form>
                    </DialogContent>
                </Dialog>
                )}
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Trainer</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Enrollment</TableHead>
              {isAdmin && <TableHead><span className="sr-only">Actions</span></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center">Loading classes...</TableCell></TableRow>
            ) : filteredAndSortedClasses.length > 0 ? (
              filteredAndSortedClasses.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.className}</TableCell>
                  <TableCell>{c.trainerName}</TableCell>
                  <TableCell>{formatDate(c.dateTime)}</TableCell>
                  <TableCell>{c.duration} min</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{c.enrolledMembers}/{c.maxMembers}</span>
                      <Progress value={(c.enrolledMembers / c.maxMembers) * 100} className="w-24 h-2" />
                    </div>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(c)}>Edit</DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem></AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the class.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteClass(c.id)}>Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center">No classes found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>

        {selectedClass && (
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Class</DialogTitle>
                <DialogDescription>Update the details of the class below.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditClass} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="className" className="text-right">Class Name</Label>
                  <Input id="className" value={selectedClass.className} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="trainerName" className="text-right">Trainer</Label>
                  <Input id="trainerName" value={selectedClass.trainerName} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="dateTime" className="text-right">Date & Time</Label>
                  <Input id="dateTime" type="datetime-local" value={selectedClass.dateTime} onChange={handleInputChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">Duration (min)</Label>
                  <Input id="duration" type="number" value={selectedClass.duration} onChange={handleInputChange} className="col-span-3" required min="1" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxMembers" className="text-right">Max Members</Label>
                  <Input id="maxMembers" type="number" value={selectedClass.maxMembers} onChange={handleInputChange} className="col-span-3" required min="1" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enrolledMembers" className="text-right">Enrolled</Label>
                  <Input id="enrolledMembers" type="number" value={selectedClass.enrolledMembers || 0} onChange={handleInputChange} className="col-span-3" required min="0" />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button type="button" variant="secondary" onClick={() => setSelectedClass(null)}>Cancel</Button></DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
