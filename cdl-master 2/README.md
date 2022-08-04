Simple python script to generator semi-random data for a sample file-management metadata schema.  Used `python 3` and mainly the `faker` data generator package. Uses python `lambda` functions to generate each type-specific field in the schema, then loops over the schema dictionary to generate a value for each field.

$$Dependencies$$

>1. faker
>2. faker_enum
>3. pymongo (for bson.json_util)

```> pip install faker faker_enum pymongo```

$$Usage$$
> python gendata.py > [target_file].json
