interface Booking {
    $id: string;
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    propertyId: string;
    agentId: string;
    userId: string;
    date: string;  // Changed from DateTime to string to match your schema
    time: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'; // Lowercase to match your schema
    notes?: string;
    property?: {
        $id: string;
        name: string;
        image?: string;
        address?: string;
    } | null;
    agent?: {
        $id: string;
        name: string;
        email: string;
        avatar: string;
    } | null;
}