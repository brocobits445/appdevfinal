import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button'; // Corrected import path
import { Input } from '@/components/ui/input';   // Corrected import path
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'; // Corrected import path
import { cn } from '@/lib/utils';     // Corrected import path

// Address interface for Mapbox integration
interface MapboxAddress {
    label: string;
    street: string;
    city: string;
    state: string;
    zipcode: string;
    latitude: number;
    longitude: number;
}

// Zod schema for form validation
const formSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    phoneNumber: z.string().regex(/^(\+?\d{1,3}[- ]?)?\d{3}[- ]?\d{4}$/, {
        message: 'Invalid phone number format.',
    }),
    address: z.object({
        label: z.string().min(1, "Address is required"),
        street: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipcode: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional()
    }),
});

const UserRegistrationForm = () => {
    const [selectedAddress, setSelectedAddress] = useState<MapboxAddress | null>(null);
    const [addressInputValue, setAddressInputValue] = useState<string>('');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            address: { label: '' },
        },
    });

    // Simulate Mapbox address selection
    const handleAddressSelect = (address: MapboxAddress) => {
        setSelectedAddress(address);
        form.setValue('address', address);
        setAddressInputValue(address.label);
    };

    // Simulate fetching address suggestions
    const fetchAddressSuggestions = (query: string): Promise<MapboxAddress[]> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!query) {
                    resolve([]);
                    return;
                }
                const suggestions: MapboxAddress[] = [
                    {
                        label: `${query}, Anytown, CA 12345`,
                        street: query,
                        city: 'Anytown',
                        state: 'CA',
                        zipcode: '12345',
                        latitude: 34.0522,
                        longitude: -118.2437,
                    },
                    {
                        label: `${query} St, Somecity, CA 67890`,
                        street: `${query} St`,
                        city: 'Somecity',
                        state: 'CA',
                        zipcode: '67890',
                        latitude: 34.1522,
                        longitude: -118.3437,
                    },
                    {
                        label: `Apt ${query}, Othertown, CA 98765`,
                        street: `Apt ${query}`,
                        city: 'Othertown',
                        state: 'CA',
                        zipcode: '98765',
                        latitude: 34.2522,
                        longitude: -118.4437
                    }
                ].filter(addr => addr.label.toLowerCase().includes(query.toLowerCase()));
                resolve(suggestions);
            }, 500);
        });
    };

    const handleAddressInputChange = async (value: string) => {
        setAddressInputValue(value);
        if (value.length > 2) {
            const suggestions = await fetchAddressSuggestions(value);
            console.log("Address suggestions:", suggestions);
        }
        if (!value) {
            setSelectedAddress(null);
            form.setValue('address', { label: '' });
        }
    };

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log('Form data:', data);
        alert('Form submitted! (See console for data)');
    };

    // use useEffect to set default value.
    useEffect(() => {
        if (selectedAddress) {
            setAddressInputValue(selectedAddress.label);
        }
    }, [selectedAddress]);

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">User Registration</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Email" {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Phone Number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter address"
                                        value={addressInputValue}
                                        onChange={(e) => handleAddressInputChange(e.target.value)}
                                        className={cn(selectedAddress && "bg-gray-50")}
                                    />
                                </FormControl>
                                {selectedAddress && (
                                    <div className="mt-2 text-sm text-gray-500">
                                        Selected Address: {selectedAddress.label}
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Register</Button>
                </form>
            </Form>
        </div>
    );
};

export default UserRegistrationForm;
