import sys
from array import array
from curses import has_key
from enum import Enum, IntEnum
from datetime import datetime
from time import strftime, strptime
from xmlrpc.client import boolean
import faker
from faker_enum import EnumProvider
import pymongo
from bson import json_util
from timeit import default_timer as timer

fake = faker.Faker()
fake.add_provider( EnumProvider )
faker.Generator.seed(1234)

class StatusEnum(IntEnum): 
    NEW=1
    OLD=2
    UNDEFINED=3
    ARCHIVE=4
    DELETED=9 

names = []
for i in range(1000) : names.append( fake.name() )

lockers = []
for i in range(50) : lockers.append( fake.name() )

URI = 'file:///Users/charlielittle/Documents/GitHub/cdl/docs/%s'
filenames = [ 'Cloud Provider PCI Responsibility Summary.pdf', 'Cloud Services Overview.pdf', 'Metrics _ Atlas_ MongoDB Atlas.pdf', 'MongoDB - 2018 Type 2 SOC 2 - Report 2.pdf', 'MongoDB - 2018 Type 2 SOC 2 - Report.pdf', 'MongoDB - 2019 HIPAA - Report.pdf', 'MongoDB - 2019 Type 2 SOC 2 - Report.pdf', 'MongoDB - 2020 Type 2 SOC 2 - Report 2.pdf', 'MongoDB - 2020 Type 2 SOC 2 - Report.pdf', 'MongoDB - Security Assessment 2019 - Atlas.pdf', 'MongoDB Atlas Invoice - 2019-11-01 - Charlie Little Atlas.pdf', 'MongoDB Atlas Invoice - 2019-12-01 - Charlie Little Atlas.pdf', 'MongoDB ISO27001 SOA (Statement of Applicability) v2.0 CUSTOMER copy - Statement of Applicability.pdf', 'invoice-5c020c71c56c981d73aff781-20190101.pdf', 'invoice-5c2aeb08553855a4bd6e2f89-20190201.pdf', 'invoice-5d4246f05538550d625c7810-20190901.pdf', 'markdown-cheatsheet-online.pdf', 'receipt_1870f940-3a2e-4f4a-bced-fe9645c26d33.pdf', 'receipt_622e57d6-7206-4266-bb8b-9eb3d6ce2ba7.pdf', 'receipt_662ee23f-8fde-4aab-9352-7d9b16a6c927.pdf', 'receipt_aba852a6-9260-41fa-9d5c-1a389ba0b418.pdf', 'receipt_bd96f9fe-b703-408d-a202-761919bd847b.pdf', 'receipt_f047e1db-3ca2-4312-8ae2-31cc9ebbe806.pdf', 'receipt_f09cb8f0-3dcc-4c2c-ac87-bdced196bd8b.pdf' ]

d = dict()

d['bank_doc'] = {}
d['bank_doc']['customer_ref_uid'] = lambda: fake.uuid4()
d['bank_doc']['locked_by'] = lambda: fake.random_element( lockers )
d['bank_doc']['locked_dttm'] = lambda: fake.date_time_this_month()
d['record_trigger_date'] = lambda: datetime.combine( fake.date_this_year(), datetime.min.time() )
d['annotation_ind'] = lambda: fake.boolean()
d['arrangement'] = {}
d['arrangement']['entity_number'] = lambda: fake.numerify("###-33603")
d['arrangement']['type_code'] = lambda: fake.bothify("?#").upper()
d['arrangement']['number'] = lambda: fake.bban()
d['content_path'] = lambda: URI % ( fake.random_element( filenames ) )
d['doc'] = {}
d['doc']['status'] = lambda: fake.enum( StatusEnum )
d['doc']['status_chng_dttm'] = lambda: fake.date_time_this_year()
d['doc']['day'] = lambda: fake.day_of_month()
d['doc']['month'] = lambda: fake.month()
d['doc']['year'] = lambda: 2022 - fake.random_int( max=5 )
d['doc']['state'] = lambda: fake.state()
d['expiration_dt'] = lambda: datetime.combine( fake.date_this_year(), datetime.min.time() )
d['fnl_ind'] = lambda: fake.boolean()
d['label'] = lambda: fake.lexify("??????????-??????????")
d['original_batch'] = lambda: fake.numerify('######')
d['origination_system_doc_uid'] = lambda: fake.uuid4()
d['page_count'] = lambda: fake.numerify('##')
d['previous_doc'] = {}
d['previous_doc']['previous_doc_uid'] = lambda: fake.uuid4()
d['previous_doc']['prev_file_size'] = lambda: fake.numerify('####KB')
d['previous_doc']['prev_repo_content_path'] = lambda: URI % ( fake.random_element( filenames ) )
d['previous_doc']['prev_repo_ref_name'] = lambda: fake.bothify("REPO-REF-??##")
d['previous_doc']['updated_by'] = lambda: "%s.%s@%s" % ( fake.first_name(), fake.last_name, fake.domain_name() )
d['previous_doc']['prev_repo_updated_dttm'] = lambda: fake.date_time_this_decade( True )
d['previous'] = [ d['previous_doc'] ]
d['reserved_ind'] = lambda: fake.boolean()
d['redacted_document_uid'] = lambda: fake.uuid4() if fake.random_digit( ) == 0 else None
d['source_doc_desc'] = lambda: fake.bs()
d['history'] = [ d['doc'] ]
d['tags'] = lambda: fake.random_elements( elements=(fake.catch_phrase().upper() + ' ' + fake.bs().upper()).split(' '), length=5, unique=True )

def genDictionaryValues( d : dict, instance : dict ) :
    for k in d.keys():
        if isinstance( d[k], dict ):
            instance[ k ] = {}
            genDictionaryValues( d[k], instance[k] )
            # for l in d[k].keys():
            #     instance[ k ][ l ] = d[k][l]()
        elif isinstance( d[k], list ):
            count = fake.random_int( min = 0, max = 10 )
            if( count ) :
                instance[ k ] = []
                for i in range( count ):
                    instance[k].append({})
                    genDictionaryValues( d[k][0], instance[k][i] )
        else :
            instance[ k ] = d[k]() # call the lambda function to generate that value
            if instance[ k ] == None : instance.pop( k ) # remove keys that don't get assigned a value

batch = []
for _ in range(2000000 - 1010000):
    instance = {}
    genDictionaryValues( d, instance )
    # instance.pop('previous_doc')
    # if( fake.random_int(min=1, max=3) == 1 ) : instance.pop( 'history', None )
    # if( fake.boolean == True ) : instance.pop( 'previous', None )
    batch.append( instance )
    if _ > 0 and len(batch) % 1000 == 0 :
       for instance in batch : print( json_util.dumps( instance ) )
       batch = []
