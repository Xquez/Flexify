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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, ChangeEvent, FormEvent, useMemo } from 'react';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/data';

export default function MembersPage() {
  const { firestore, user: currentUser } = useFirebase();
  const { toast } = useToast();

  const usersCollection = useMemoFirebase(
    () => (firestore ? collection(firestore, 'users') : null),
    [firestore]
  );
  const { data: members, isLoading } = useCollection<User>(usersCollection);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: '',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');


  const filteredAndSortedMembers = useMemo(() => {
    if (!members) return [];

    let filtered = members.filter(member => {
        const nameMatch = member.name && member.name.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = member.email && member.email.toLowerCase().includes(searchQuery.toLowerCase());
        return nameMatch || emailMatch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      }
      return nameB.localeCompare(nameA);
    });

    return sorted;
  }, [members, searchQuery, sortOrder]);


  const isAdmin = currentUser?.email === 'admin@gmail.com';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (editDialogOpen && selectedMember) {
      setSelectedMember({ ...selectedMember, [id]: value });
    } else {
      setNewMember((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleStatusChange = (value: 'Active' | 'Inactive' | 'Pending') => {
    if (selectedMember) {
        setSelectedMember({ ...selectedMember, status: value });
    }
  }

  const handleAddMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    try {
      const usersCollectionRef = collection(firestore, 'users');
      await addDoc(usersCollectionRef, {
        ...newMember,
        joinDate: newMember.joinDate ? Timestamp.fromDate(new Date(newMember.joinDate)) : serverTimestamp(),
        status: 'Active',
        role: 'member',
      });
      toast({
        title: 'Member Added',
        description: `${newMember.name} has been successfully added.`,
      });
      setAddDialogOpen(false);
      setNewMember({ name: '', email: '', phone: '', joinDate: '' });
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to add member: ${error.message}`,
      });
    }
  };

  const handleEditMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!firestore || !selectedMember) return;

    try {
      const memberDocRef = doc(firestore, 'users', selectedMember.id);
      await updateDoc(memberDocRef, {
        name: selectedMember.name,
        email: selectedMember.email,
        phone: selectedMember.phone,
        status: selectedMember.status,
      });
      toast({
        title: 'Member Updated',
        description: `Details for ${selectedMember.name} have been updated.`,
      });
      setEditDialogOpen(false);
      setSelectedMember(null);
    } catch (error: any) {
      console.error('Error updating member:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to update member: ${error.message}`,
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!firestore) return;
    try {
      const memberDocRef = doc(firestore, 'users', memberId);
      await deleteDoc(memberDocRef);
      toast({
        title: 'Member Deleted',
        description: 'The member has been successfully deleted.',
      });
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to delete member: ${error.message}`,
      });
    }
  };
  
  const handleRenewMember = async (member: User) => {
    if (!firestore) return;
    try {
        const memberDocRef = doc(firestore, 'users', member.id);
        await updateDoc(memberDocRef, { status: 'Active' });
        toast({
            title: 'Member Renewal Successful',
            description: `${member.name}'s membership has been renewed.`,
        });
    } catch (error: any) {
        console.error('Error renewing member:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to renew member: ${error.message}`,
        });
    }
  }

  const openEditDialog = (member: User) => {
    setSelectedMember(member);
    setEditDialogOpen(true);
  };
  
  const formatDate = (timestamp: any) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleDateString();
    }
    if (typeof timestamp === 'string') {
        const date = new Date(timestamp);
        if (!isNaN(date.getTime())) {
            return date.toLocaleDateString();
        }
    }
    return 'N/A';
  };
  
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                Manage your members and view their details.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search by name or email..."
                        className="pl-8 sm:w-[200px] md:w-[300px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={toggleSortOrder}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort by Name
                  </Button>
                </div>
                {isAdmin && (
                <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                    <Button>Add Member</Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Member</DialogTitle>
                        <DialogDescription>
                        Enter the details of the new member below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={newMember.name}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={newMember.email}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={newMember.phone}
                            onChange={handleInputChange}
                            className="col-span-3"
                        />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="joinDate" className="text-right">
                            Joined Date
                        </Label>
                        <Input
                            id="joinDate"
                            type="date"
                            value={newMember.joinDate}
                            onChange={handleInputChange}
                            className="col-span-3"
                            required
                        />
                        </div>
                        <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                            Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Add Member</Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">Joined</TableHead>
              {isAdmin && <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">Loading members...</TableCell>
                </TableRow>
            ) : filteredAndSortedMembers.length > 0 ? (
                filteredAndSortedMembers.map((member) => {
                const statusVariant =
                    member.status === 'Active'
                    ? 'default'
                    : member.status === 'Inactive'
                    ? 'secondary'
                    : 'outline';
                return (
                    <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                        <Badge variant={statusVariant}>{member.status}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {member.phone || 'N/A'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                        {formatDate(member.joinDate)}
                    </TableCell>
                    {isAdmin && <TableCell>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                            >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openEditDialog(member)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRenewMember(member)}>Renew</DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the member's account.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteMember(member.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>}
                    </TableRow>
                );
                })
            ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center">No members found.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
        
        {selectedMember && <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Member</DialogTitle>
                <DialogDescription>
                  Update the details of the member below.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditMember} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={selectedMember.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={selectedMember.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={selectedMember.phone || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <Select value={selectedMember.status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => setSelectedMember(null)}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>}

      </CardContent>
    </Card>
  );
}
