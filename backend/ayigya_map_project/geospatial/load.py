from pathlib import Path
from django.contrib.gis.utils import LayerMapping
from .models import (Buildings,
                     Drainag_Gutter,
                     Other_linear_Features,
                     Other_Polygon_Structure,
                     Point_of_Interest,
                     River,
                     Road
            )

buildings_mapping = {
    'shape_area': 'Shape__Are',
    'shape_length': 'Shape__Len',
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'num_of_storey': 'Num_Storey',
    'building_t': 'Building_T',
    'ghanapost_field': 'GhanaPost_',
    'plot_number': 'Plot_Numbe',
    'developmen': 'Developmen',
    'name': 'Name',
    'parcel_id': 'Parcel_Id',
    'exact_use': 'Exact_Use',
    'building_u': 'Building_U',
    'mixed_use': 'Mixed_Use',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'geom': 'MULTIPOLYGONZM',
}


drainag_gutter_mapping = {
    'shape_length': 'Shape__Len',
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'condition': 'Condition',
    'geom': 'MULTILINESTRING25D',
}


other_linear_features_mapping = {
    'shape_length': 'Shape__Len',
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'name': 'Name',
    'geom': 'MULTILINESTRING25D',
}

other_polygon_structure_mapping = {
    'shape_area': 'Shape__Are',
    'shape_length': 'Shape__Len',
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'exact_use': 'Exact_Use',
    'usage1': 'Usage1',
    'developmen': 'Developmen',
    'structure_field': 'Structure_',
    'ghanapostg': 'GhanaPostG',
    'street_nam': 'Street_Nam',
    'name': 'Name',
    'parcel_id': 'Parcel_Id',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'mixed_usag': 'Mixed_Usag',
    'geom': 'MULTIPOLYGONZM',
}


point_of_interest_mapping = {
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'usage1': 'Usage1',
    'owner': 'Owner',
    'name': 'Name',
    'geom': 'MULTIPOINT25D',
}


river_mapping = {
    'shape_length': 'Shape__Len',
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'water_type': 'Water_Type',
    'name': 'Name',
    'geom': 'MULTILINESTRING25D',
}

road_mapping = {
    'shape_length': 'Shape__Len',
    'globalid': 'GlobalID',
    'creationda': 'CreationDa',
    'creator': 'Creator',
    'editdate': 'EditDate',
    'editor': 'Editor',
    'remarks': 'Remarks',
    'other_info': 'Other_Info',
    'other_in_1': 'Other_In_1',
    'surface_ty': 'Surface_Ty',
    'name': 'Name',
    'drain': 'Drain',
    'road_type': 'Road_Type',
    'geom': 'MULTILINESTRING25D',
}





mappping = [
        ("Building",Buildings,buildings_mapping),
        ("Drainag_Gutter",Drainag_Gutter,drainag_gutter_mapping),
        ("Other_linear_Features",Other_linear_Features,other_linear_features_mapping),
        ("Other_Polygon_Structure",Other_Polygon_Structure,other_polygon_structure_mapping),
        ("Point_of_Interest",Point_of_Interest,point_of_interest_mapping),
        ("River",River,river_mapping),
        ("Road",Road,road_mapping)
        ]



def run(verbose=True):
    for shapefile_file_name,model,data_mapping in mappping:
        road_shp = Path(__file__).resolve().parent / "SummerCampData" / f"{shapefile_file_name}.shp"
        print("path",road_shp)
        lm = LayerMapping(model, road_shp, data_mapping, transform=True)
        lm.save(strict=True, verbose=verbose)

