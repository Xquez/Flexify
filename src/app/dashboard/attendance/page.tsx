
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
import { MoreHorizontal } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, where, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/data';
import type { GymClass } from '../schedule/page';

export type Attendance = {
  id: string;
  userId: string;
  classId: string;
  date: Timestamp;
  status: 'Present' | 'Absent';
};

export default function AttendancePage() {
  const { firestore, user: currentUser } = useFirebase();
  const { toast } = useToast();

  const isAdmin = currentUser?.email === 'admin@gmail.com';

  const attendanceQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (isAdmin) {
      return collection(firestore, 'attendances');
    }
    return query(collection(firestore, 'attendances'), where('userId', '==', currentUser?.uid));
  }, [firestore, currentUser, isAdmin]);

  const { data: attendance, isLoading } = useCollection<Attendance>(attendanceQuery);
  const { data: members } = useCollection<User>(useMemoFirebase(() => firestore ? collection(firestore, 'users') : null, [firestore]));
  const { data: classes } = useCollection<GymClass>(useMemoFirebase(() => firestore ? collection(firestore, 'schedules') : null, [firestore]));

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);
  const [newAttendance, setNewAttendance] = useState({
    userId: '',
    classId: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present' as 'Present' | 'Absent',
  });

  const memberMap = useMemo(() => new Map(members?.map(m => [m.id, m.name])), [members]);
  const classMap = useMemo(() => new Map(classes?.map(c => [c.id, c.className])), [classes]);

  const handleInputChange = (id: string, value: string) => {
    if (editDialogOpen && selectedAttendance) {
      setSelectedAttendance({ ...selectedAttendance, [id]: value });
    } else {
      setNewAttendance((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    if (editDialogOpen && selectedAttendance) {
        if (id === 'status') {
            setSelectedAttendance({ ...selectedAttendance, status: value as 'Present' | 'Absent' });
        }
    } else {
        if (id === 'userId' || id === 'classId') {
            setNewAttendance((prev) => ({ ...prev, [id]: value }));
        } else if (id === 'status') {
            setNewAttendance((prev) => ({ ...prev, status: value as 'Present' | 'Absent' }));
        }
    }
  }

  const handleAddAttendance = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore || !newAttendance.userId || !newAttendance.classId) return;

    if (new Date(newAttendance.date) > new Date()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Date',
        description: 'Cannot mark attendance for a future date.',
      });
      return;
    }

    try {
      const attendanceCollectionRef = collection(firestore, 'attendances');
      await addDoc(attendanceCollectionRef, {
        ...newAttendance,
        date: Timestamp.fromDate(new Date(newAttendance.date)),
      });
      toast({
        title: 'Attendance Marked',
        description: `Attendance has been successfully recorded.`,
      });
      setAddDialogOpen(false);
      setNewAttendance({ userId: '', classId: '', date: new Date().toISOString().split('T')[0], status: 'Present' });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to mark attendance: ${error.message}`,
      });
    }
  };

  const handleEditAttendance = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore || !selectedAttendance) return;

    try {
      const attendanceDocRef = doc(firestore, 'attendances', selectedAttendance.id);
      await updateDoc(attendanceDocRef, {
        status: selectedAttendance.status,
      });
      toast({
        title: 'Attendance Updated',
        description: `Attendance record has been updated.`,
      });
      setEditDialogOpen(false);
      setSelectedAttendance(null);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update attendance: ${error.message}`,
      });
    }
  };

  const handleDeleteAttendance = async (attendanceId: string) => {
    if (!firestore) return;
    try {
      const attendanceDocRef = doc(firestore, 'attendances', attendanceId);
      await deleteDoc(attendanceDocRef);
      toast({
        title: 'Attendance Record Deleted',
        description: 'The record has been successfully deleted.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete record: ${error.message}`,
      });
    }
  };

  const openEditDialog = (att: Attendance) => {
    setSelectedAttendance(att);
    setEditDialogOpen(true);
  };
  
  const formatDate = (timestamp: any) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    return 'N/A';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>
              {isAdmin ? 'Manage member attendance for classes.' : 'View your attendance history.'}
            </CardDescription>
          </div>
          {isAdmin && (
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild><Button>Mark Attendance</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Mark New Attendance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddAttendance} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="userId" className="text-right">Member</Label>
                        <Select onValueChange={(value) => handleSelectChange('userId', value)} value={newAttendance.userId}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a member" /></SelectTrigger>
                            <SelectContent>
                                {members?.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="classId" className="text-right">Class</Label>
                        <Select onValueChange={(value) => handleSelectChange('classId', value)} value={newAttendance.classId}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a class" /></SelectTrigger>
                            <SelectContent>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.className}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">Date</Label>
                        <Input id="date" type="date" value={newAttendance.date} onChange={(e) => handleInputChange('date', e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select onValueChange={(value) => handleSelectChange('status', value)} value={newAttendance.status}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {isAdmin && <TableHead>Member</TableHead>}
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead><span className="sr-only">Actions</span></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow><TableCell colSpan={isAdmin ? 5: 4} className="text-center">Loading attendance...</TableCell></TableRow>
            ) : attendance && attendance.length > 0 ? (
              attendance.map((att) => (
                <TableRow key={att.id}>
                  {isAdmin && <TableCell>{memberMap.get(att.userId) || 'Unknown'}</TableCell>}
                  <TableCell>{classMap.get(att.classId) || 'Unknown'}</TableCell>
                  <TableCell>{formatDate(att.date)}</TableCell>
                  <TableCell>
                    <Badge variant={att.status === 'Present' ? 'default' : 'destructive'}>{att.status}</Badge>
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Toggle menu</span></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(att)}>Edit</DropdownMenuItem>
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete this attendance record.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteAttendance(att.id)}>Continue</AlertDialogAction>
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
              <TableRow><TableCell colSpan={isAdmin ? 5 : 4} className="text-center">No attendance records found.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>

         {selectedAttendance && <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Attendance</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEditAttendance} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Member</Label>
                        <Input value={memberMap.get(selectedAttendance.userId)} className="col-span-3" disabled />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Class</Label>
                        <Input value={classMap.get(selectedAttendance.classId)} className="col-span-3" disabled />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">Status</Label>
                        <Select onValueChange={(value) => handleSelectChange('status', value)} value={selectedAttendance.status}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary" onClick={() => setSelectedAttendance(null)}>Cancel</Button></DialogClose>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>}
      </CardContent>
    </Card>
  );
}
