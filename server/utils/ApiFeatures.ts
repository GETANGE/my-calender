class ApiFeatures {
    query: any;
    queryStrings: any;
    queryOptions: any;

    constructor(query: any, queryStrings: any) {
        this.query = query;
        this.queryStrings = queryStrings;
        this.queryOptions = {};
    }

    /**
     *  FILTERING
     */
    filtering() {
        const queryObject: any = { ...this.queryStrings };
        const excludedFields = ['page', 'sort', 'fields', 'limit'];
        excludedFields.forEach((field) => delete queryObject[field]);

        // PERFORMING ADVANCED FILTERING.
        let queryStr = JSON.stringify(queryObject);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match: any) => `$${match}`);

        // Convert the operators to Prisma format
        const parsedQuery = JSON.parse(queryStr);
        const prismaQuery = this.convertToPrismaQuery(parsedQuery);

        if (Object.keys(prismaQuery).length > 0) {
            this.queryOptions.where = prismaQuery;
        }

        return this;
    }

    /**
     *  SORTING
     */
    sorting() {
        if (this.queryStrings.sort) {
            const sortFields = this.queryStrings.sort.split(',');
            const orderBy: any[] = sortFields.map((field: string) => {
                const direction = field.startsWith('-') ? 'desc' : 'asc';
                const fieldName = field.startsWith('-') ? field.slice(1) : field;
                return { [fieldName]: direction };
            });

            this.queryOptions.orderBy = orderBy;
        } else {
            this.queryOptions.orderBy = { createdAt: 'desc' };
        }

        return this;
    }

    /**
     *  LIMITING 
     */
    limiting() {
        if (this.queryStrings.fields) {
            const fields = this.queryStrings.fields.split(',');
            const select = fields.reduce((acc: any, field: string) => {
                acc[field.trim()] = true;
                return acc;
            }, {});

            this.queryOptions.select = select;
        }

        return this;
    }

    /**
     * PAGINATION
     */
    pagination() {
        const page = parseInt(this.queryStrings.page) || 1;
        const limit = parseInt(this.queryStrings.limit) || 10;
        const skip = (page - 1) * limit;

        this.queryOptions.skip = skip;
        this.queryOptions.take = limit;

        return this;
    }

    /**
     * Helper method to convert MongoDB-style queries to Prisma format
     */
    private convertToPrismaQuery(query: any) {
        const prismaQuery: any = {};
        
        for (const [key, value] of Object.entries(query)) {
            if (typeof value === 'object') {
                const conditions: any = {};
                for (const [operator, operatorValue] of Object.entries(value as any)) {
                    switch (operator) {
                        case '$gt':
                            conditions.gt = operatorValue;
                            break;
                        case '$gte':
                            conditions.gte = operatorValue;
                            break;
                        case '$lt':
                            conditions.lt = operatorValue;
                            break;
                        case '$lte':
                            conditions.lte = operatorValue;
                            break;
                    }
                }
                prismaQuery[key] = conditions;
            } else {
                prismaQuery[key] = value;
            }
        }
        
        return prismaQuery;
    }

    /**
     * Execute the query with all options
     */
    async execute() {
        return await this.query.findMany(this.queryOptions);
    }
}

export default ApiFeatures;