# from django.contrib.gis.db import models


# class Buildings(models.Model):
#     shape_area = models.FloatField()
#     shape_length = models.FloatField()
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     num_of_storey = models.BigIntegerField()
#     building_t = models.CharField(max_length=254)
#     ghanapost_field = models.CharField(max_length=254)
#     plot_number = models.CharField(max_length=254)
#     developmen = models.CharField(max_length=254)
#     name = models.CharField(max_length=254)
#     parcel_id = models.CharField(max_length=254)
#     exact_use = models.CharField(max_length=254)
#     building_u = models.CharField(max_length=254)
#     mixed_use = models.CharField(max_length=254)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     geom = models.MultiPolygonField(srid=4326)


# class Drainag_Gutter(models.Model):
#     shape_length = models.FloatField()
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     condition = models.CharField(max_length=254)
#     geom = models.MultiLineStringField(srid=4326)

# class Other_linear_Features(models.Model):
#     shape_length = models.FloatField()
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     name = models.CharField(max_length=254)
#     geom = models.MultiLineStringField(srid=4326)


# class Other_Polygon_Structure(models.Model):
#     shape_area = models.FloatField()
#     shape_length = models.FloatField()
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     exact_use = models.CharField(max_length=254)
#     usage1 = models.CharField(max_length=254)
#     developmen = models.CharField(max_length=254)
#     structure_field = models.CharField(max_length=254)
#     ghanapostg = models.CharField(max_length=254)
#     street_nam = models.CharField(max_length=254)
#     name = models.CharField(max_length=254)
#     parcel_id = models.CharField(max_length=254)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     mixed_usag = models.CharField(max_length=254)
#     geom = models.MultiPolygonField(srid=4326)

# class Point_of_Interest(models.Model):
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     usage1 = models.CharField(max_length=254)
#     owner = models.CharField(max_length=254)
#     name = models.CharField(max_length=254)
#     geom = models.MultiPointField(srid=4326)

# class River(models.Model):
#     shape_length = models.FloatField()
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     water_type = models.CharField(max_length=254)
#     name = models.CharField(max_length=254)
#     geom = models.MultiLineStringField(srid=4326)

# class Road(models.Model):
#     shape_length = models.FloatField()
#     globalid = models.CharField(max_length=38)
#     creationda = models.DateField()
#     creator = models.CharField(max_length=128)
#     editdate = models.DateField()
#     editor = models.CharField(max_length=128)
#     remarks = models.CharField(max_length=254)
#     other_info = models.CharField(max_length=254)
#     other_in_1 = models.CharField(max_length=254)
#     surface_ty = models.CharField(max_length=254)
#     name = models.CharField(max_length=254)
#     drain = models.CharField(max_length=254)
#     road_type = models.CharField(max_length=254)
#     geom = models.MultiLineStringField(srid=4326)


# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models


















class Building(models.Model):
    gid = models.AutoField(primary_key=True)
    shape_are = models.DecimalField(db_column='shape__are', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    shape_len = models.DecimalField(db_column='shape__len', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    num_storey = models.FloatField(blank=True, null=True)
    building_t = models.CharField(max_length=254, blank=True, null=True)
    ghanapost_field = models.CharField(db_column='ghanapost_', max_length=254, blank=True, null=True)  # Field renamed because it ended with '_'.
    plot_numbe = models.CharField(max_length=254, blank=True, null=True)
    developmen = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    parcel_id = models.CharField(max_length=254, blank=True, null=True)
    exact_use = models.CharField(max_length=254, blank=True, null=True)
    building_u = models.CharField(max_length=254, blank=True, null=True)
    mixed_use = models.CharField(max_length=254, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiPolygonField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'building'











class DrainagGutter(models.Model):
    gid = models.AutoField(primary_key=True)
    shape_len = models.DecimalField(db_column='shape__len', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    condition = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiLineStringField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'drainag_gutter'


class OtherLinearFeatures(models.Model):
    gid = models.AutoField(primary_key=True)
    shape_len = models.DecimalField(db_column='shape__len', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiLineStringField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'other_linear_features'


class OtherPolygonStructure(models.Model):
    gid = models.AutoField(primary_key=True)
    shape_are = models.DecimalField(db_column='shape__are', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    shape_len = models.DecimalField(db_column='shape__len', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    exact_use = models.CharField(max_length=254, blank=True, null=True)
    usage1 = models.CharField(max_length=254, blank=True, null=True)
    developmen = models.CharField(max_length=254, blank=True, null=True)
    structure_field = models.CharField(db_column='structure_', max_length=254, blank=True, null=True)  # Field renamed because it ended with '_'.
    ghanapostg = models.CharField(max_length=254, blank=True, null=True)
    street_nam = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    parcel_id = models.CharField(max_length=254, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    mixed_usag = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiPolygonField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'other_polygon_structure'


class PointOfInterest(models.Model):
    gid = models.AutoField(primary_key=True)
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    usage1 = models.CharField(max_length=254, blank=True, null=True)
    owner = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    geom = models.PointField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'point_of_interest'


class River(models.Model):
    gid = models.AutoField(primary_key=True)
    shape_len = models.DecimalField(db_column='shape__len', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    water_type = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiLineStringField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'river'


class Road(models.Model):
    gid = models.AutoField(primary_key=True)
    shape_len = models.DecimalField(db_column='shape__len', max_digits=100, decimal_places=50, blank=True, null=True)  # Field renamed because it contained more than one '_' in a row.
    globalid = models.CharField(max_length=38, blank=True, null=True)
    creationda = models.DateField(blank=True, null=True)
    creator = models.CharField(max_length=128, blank=True, null=True)
    editdate = models.DateField(blank=True, null=True)
    editor = models.CharField(max_length=128, blank=True, null=True)
    remarks = models.CharField(max_length=254, blank=True, null=True)
    other_info = models.CharField(max_length=254, blank=True, null=True)
    other_in_1 = models.CharField(max_length=254, blank=True, null=True)
    surface_ty = models.CharField(max_length=254, blank=True, null=True)
    name = models.CharField(max_length=254, blank=True, null=True)
    drain = models.CharField(max_length=254, blank=True, null=True)
    road_type = models.CharField(max_length=254, blank=True, null=True)
    geom = models.MultiLineStringField(srid=3857, dim=4, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'road'
